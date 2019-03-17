import React, { Component } from 'react'
import { API } from 'aws-amplify'
import { Dropdown, Loader, Segment } from 'semantic-ui-react'
import PhoneFormList from '../phoneNumbers/PhoneFormList'
import LoaderButton from '../../components/LoaderButton'
import uuid from 'uuid'
import './NewContact.css'

/*
    TODO: ADD UPDATES TO PHONE TABLE AND CLIENT TABLE
*/

const preferredMethods = [
    { text: 'Home', value: 'Home' },
    { text: 'Cell', value: 'Cell' },
    { text: 'Email', value: 'Email' },
    { text: 'Fax', value: 'Fax' }
]

export default class NewContact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            name: '',
            email: '',
            toggleNewClient: false,
            clients: [],
            client: {},
            preferredContactMethod: null,
            phoneNumbers: [],
        }
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return
        }

        try {
            const loader = await this.loadClients()
            const clients = this.formatClientList(loader)
            this.setState({ clients })
        } catch (e) {
            alert(e)
        }

        this.setState({ isLoading: false });
    }

    formatClientList = (clientList) => {
        return clientList.map((client) => {
            return {
                key: client.clientId,
                text: client.name,
                value: client.name
            }
        })
    }

    loadClients() {
        const result = API.get('clients', '/clients')
        return result
    }

    validateForm() {
        return this.state.name.length > 0
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    handleSelectChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleClientChange = (e, { value, options }) => {
        const option = options.filter((i) => i.value === value)

        if (option.length === 0) {
            const id = uuid.v1()

            this.setState(() => ({
                client: { clientId: id, name: value },
                clients: [{ key: id, text: value, value: value }, ...this.state.clients],
                toggleNewClient: true
            }))
        } else {
            const buildClient = {
                clientId: option[0].key,
                name: option[0].value
            }

            this.setState(() => ({
                client: buildClient,
                toggleNewClient: false
            }))
        }
    }

    handleAddPhoneNumber = (phoneNumber) => {
        this.setState((prev) => ({
            phoneNumbers: prev.phoneNumbers.concat(phoneNumber)
        }))
    }

    handleRemovePhoneNumber = (id) => {
        this.setState((prev) => ({
            phoneNumbers: prev.phoneNumbers.filter((pn) => pn.id !== id)
        }))
    }

    toggleNewClient = () => {
        this.setState({ toggleNewClient: true })
    }

    handleSubmit = async (e) => {
        e.preventDefault(e)
        const { name, email, client, preferredContactMethod } = this.state

        this.setState({ isLoading: true });
        try {
            await this.createContact({
                content: {
                    contactId: uuid.v1(),
                    clientId: client.clientId,
                    name,
                    email,
                    preferredContactMethod
                }
            })

            await this.createClient({
                content: {
                    clientId: client.clientId,
                    name: client.clientName
                }
            })
            this.props.history.push('/contacts')
        } catch (e) {
            alert(e)
            this.setState({ isLoading: false });
        }
    }

    createContact(contact) {
        return API.post('contacts', '/contacts', {
            body: contact
        })
    }

    createClient(client) {
        return API.post('clients', '/clients', {
            body: client
        })
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }

        const { name, email, client, preferredContactMethod } = this.state
        return (
            <form onSubmit={this.handleSubmit} className='container'>
                <div>
                    <div className='form-group'>
                        <label>Contact Name:</label>
                        <input
                            className='form-control'
                            name='name'
                            value={name}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Client Relation:</label>
                        {/* Replace with select element */}
                        <Dropdown
                            className='form-control'
                            name='client'
                            placeholder='Search client list...'
                            search
                            selection
                            allowAdditions
                            additionLabel='Create new client: '
                            options={this.state.clients}
                            value={client.name}
                            onChange={this.handleClientChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Email:</label>
                        <input
                            className='form-control'
                            type='email'
                            name='email'
                            value={email}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Preferred Contact Method:</label>
                        {/* Replace with select element */}
                        <Dropdown
                            className='form-control'
                            name='preferredContactMethod'
                            placeholder={`Contact's preffered contact method...`}
                            search
                            selection
                            options={preferredMethods}
                            value={preferredContactMethod}
                            onChange={this.handleSelectChange}
                        />
                    </div>
                </div>
                <label>Phone Numbers</label>
                <PhoneFormList
                    addPhoneNumber={this.handleAddPhoneNumber}
                    removePhoneNumber={this.handleRemovePhoneNumber}
                />
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
            </form >
        )
    }
}