import React, { Component } from 'react'
import { Form, Input, Segment } from 'semantic-ui-react'
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
        console.log('State: ', this.state)
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
                this.createAddress({
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
                this.createPhonenumber({
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

    createAddress(address){
        return API.post('address', '/address', {
            body: address
        })
    }

    createPhonenumber(phonenumber){
        return API.post('phonenumbers', '/phonenumbers', {
            body: phonenumber
        })
    }

    render() {
        const { name, type, contact, email } = this.state
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <label>Details</label>
                    <Segment>
                        <Form.Field required>
                            <label>Client Name:</label>
                            <Input
                                fluid
                                name='name'
                                value={name}
                                placeholder='Enter client name'
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                        <Form.Field required>
                            <label>Client Type</label>
                            <Form.Dropdown
                                name='type'
                                placeholder='Pick client type'
                                search
                                selection
                                options={clientTypes}
                                value={type}
                                onChange={this.handleSelectChange}
                            />
                        </Form.Field>
                        <Form.Field required>
                            <label>Contact</label>
                            <Form.Dropdown
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
                        </Form.Field>
                        <Form.Field>
                            <label>Client email:</label>
                            <Input
                                fluid
                                name='email'
                                value={email}
                                placeholder='Enter client email'
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                    </Segment>
                    <Form.Field>
                        <label>Phone Numbers</label>
                        <PhoneFormList
                            addPhoneNumber={this.handleAddPhoneNumber}
                            removePhoneNumber={this.handleRemovePhoneNumber}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Addresses</label>
                        <AddressFormList
                            addAddress={this.handleAddAddress}
                            removeAddress={this.handleRemoveAddress}
                        />
                    </Form.Field>
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
                </Form>
            </div>
        )
    }
}