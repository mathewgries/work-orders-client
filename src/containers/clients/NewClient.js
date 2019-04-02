import React, { Component } from 'react'
import { Dropdown, Segment } from 'semantic-ui-react'
import AddressFormList from '../addresses/AddressFormList'
import PhoneFormList from '../phoneNumbers/PhoneFormList'
import LoaderButton from '../../components/LoaderButton'
import uuid from 'uuid'
import { API } from 'aws-amplify'

const clientTypes = [
    { text: 'Residential', value: 'Residential' },
    { text: 'Commercial', value: 'Commercial' },
    { text: 'Other', value: 'Other' }
]

export default class NewClient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            toggleNewContact: false,
            contacts: [],
            name: '',
            type: '',
            contact: {},
            email: '',
            addresses: [],
            phonenumbers: []
        }
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return
        }

        try {
            const loadedContacts = await this.loadContacts()
            this.setState(() => ({
                contacts: this.formatContacts(loadedContacts),
                isLoading: false
            }))
        } catch (e) {
            alert(e)
        }
    }

    loadContacts() {
        return API.get('contacts', '/contacts')
    }

    formatContacts(contacts) {
        return contacts.map((contact) => {
            return {
                key: contact.contactId,
                text: contact.name,
                value: contact.name
            }
        })
    }

    validateForm() {
        const { name, type } = this.state
        return name.length > 0
            && type.length > 0
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    handleSelectChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleContactChange = (e, { value, options }) => {
        const option = options.filter((i) => i.value === value)

        if (option.length === 0) {
            const id = uuid.v1()

            this.setState(() => ({
                contact: { contactId: id, name: value },
                contacts: [{ key: id, text: value, value: value }, ...this.state.contacts],
                toggleNewContact: true
            }))
        } else {
            const buildContact = {
                contactId: option[0].key,
                name: option[0].value
            }

            this.setState(() => ({
                contact: buildContact,
                toggleNewContact: false
            }))
        }
    }

    handleAddPhoneNumber = (phoneNumber) => {
        this.setState((prev) => ({
            phonenumbers: prev.phonenumbers.concat(phoneNumber)
        }))
    }

    handleRemovePhoneNumber = (id) => {
        this.setState((prev) => ({
            phonenumbers: prev.phonenumbers.filter((pn) => pn.phonenumerId !== id)
        }))
    }

    handleAddAddress = (address) => {
        this.setState((prev) => ({
            addresses: prev.addresses.concat(address)
        }))
    }

    handleRemoveAddress = (id) => {
        this.setState((prev) => ({
            addresses: prev.addresses.filter((ad) => ad.addressId !== id)
        }))
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        this.setState({ isLoading: true })
        const { name, email, type, contact, addresses, phonenumbers } = this.state
        try {
            const clientId = uuid.v1()

            await this.createClient({
                content: {
                    clientId,
                    name,
                    email,
                    type,
                    addresses,
                    phonenumbers,
                    contact
                }
            })

            await this.createContact({
                content: {
                    contactId: contact.contactId,
                    name: contact.name,
                    clientId
                }
            })

            await addresses.map((address) => {
                return this.createAddress({
                    content: {
                        clientId,
                        addressId: address.addressId,
                        addressType: address.addressType,
                        country: 'US',
                        line1: address.line1,
                        line2: address.line2,
                        city: address.city,
                        state: address.state,
                        zipCode: address.zipCode,
                        zipCode4: address.zipCode4
                    }
                })
            })

            await phonenumbers.map((pn) => {
                return this.createPhonenumber({
                    content: {
                        phonenumberId: pn.phonenumberId,
                        clientId,
                        phoneType: pn.phoneType,
                        phonenumber: pn.phonenumber,
                        countryCode: pn.countryCode
                    }
                })
            })

            this.props.history.push('/clients')
        } catch (e) {
            alert(e)
            this.setState({ isLoading: false })
        }
    }

    createClient(client) {
        return API.post('clients', '/clients', {
            body: client
        })
    }

    createContact(contact) {
        return API.post('contacts', '/contacts', {
            body: contact
        })
    }

    createAddress(address) {
        return API.post('address', '/address', {
            body: address
        })
    }

    createPhonenumber(phonenumber) {
        return API.post('phonenumbers', '/phonenumbers', {
            body: phonenumber
        })
    }

    render() {
        const { name, type, contact, email } = this.state
        return (
            <form onSubmit={this.handleSubmit} className='container'>
                <label>Details</label>
                <Segment>
                    <div className='form-group'>
                        <label>Client Name:</label>
                        <input
                            className='form-control'
                            name='name'
                            value={name}
                            placeholder='Enter client name'
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Client Type</label>
                        <Dropdown
                            className='form-control'
                            name='type'
                            placeholder='Pick client type'
                            search
                            selection
                            options={clientTypes}
                            value={type}
                            onChange={this.handleSelectChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Contact</label>
                        <Dropdown
                            className='form-control'
                            clearable
                            search
                            selection
                            allowAdditions
                            additionLabel='Ceate new contact: '
                            placeholder='Select contact'
                            options={this.state.contacts}
                            onChange={this.handleContactChange}
                            value={contact.name}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Client email:</label>
                        <input
                            className='form-control'
                            name='email'
                            value={email}
                            placeholder='Enter client email'
                            onChange={this.handleChange}
                        />
                    </div>
                </Segment>
                <div className='form-group'>
                    <label>Phone Numbers</label>
                    <PhoneFormList
                        addPhoneNumber={this.handleAddPhoneNumber}
                        removePhoneNumber={this.handleRemovePhoneNumber}
                    />
                </div>
                <div className='form-group'>
                    <label>Addresses</label>
                    <AddressFormList
                        addAddress={this.handleAddAddress}
                        removeAddress={this.handleRemoveAddress}
                    />
                </div>
                <LoaderButton
                    block
                    bsStyle="primary"
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Create"
                    loadingText="Creating…"
                />
            </form>
        )
    }
}