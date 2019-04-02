import React, { Component } from "react"
import { Segment, Dropdown } from 'semantic-ui-react'
import WorkordersItemsFormsList from '../../containers/workorderItems/WorkordersItemsFormsList'
import { getWorkorderById, updateWorkorder, deleteWorkorder } from '../../api/workorders'
import { getWorkorderItemsByWorkorderId } from '../../api/workordersItems'
import { getClientsForDropDown, createClientOnNewWorkorder } from '../../api/clients'
import { getContactsForDropDown, createContactOnNewWorkorder, getContactById, addClientToContact } from '../../api/contacts'
import './Workorders.css'
import LoadingStatus from "../../components/LoadingStatus"

export default class WorkordersEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            isDeleting: false,
            toggleNewClient: false,
            toggleNewContact: false,
            workorderId: null,
            title: '',
            client: {},
            clients: [],
            contact: {},
            contacts: [],
            description: '',
            workorderItems: [],
            newWorkorderItems: [],
            removedWorkorderItems: [],
            updatedWorkorderItems: []

        }
    }

    async componentDidMount() {
        try {
            const workorder = await getWorkorderById(this.props.match.params.id);
            const workorderItems = await getWorkorderItemsByWorkorderId(this.props.match.params.id)
            const clients = await getClientsForDropDown()
            const contacts = await getContactsForDropDown()
            const client = this.setClient(workorder.clientId, clients)
            const contact = this.setContact(workorder.contactId, contacts)
            const { workorderId, title, description } = workorder

            this.setState({
                workorderId,
                title,
                client,
                clients,
                contact,
                contacts,
                description,
                workorderItems
            });
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false })
    }

    setClient(clientId, clients) {
        const client = clients.filter((client) => client.key === clientId)
        return { clientId: client[0].key, name: client[0].text }
    }

    setContact(contactId, contacts) {
        const contact = contacts.filter((contact) => contact.key === contactId)
        return { contactId: contact[0].key, name: contact[0].text }
    }

    validateForm() {
        const { title, client, contact, description } = this.state
        return title.length > 0 || client.length > 0 || contact.length > 0 || description.length > 0
    }

    formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    handleAddWorkordersItem = (newWorkorderItem) => {
        this.setState((prev) => ({
            workorderItems: prev.workorderItems.concat(newWorkorderItem),
            newWorkorderItems: prev.newWorkorderItems.concat(newWorkorderItem)
        }))
    }

    handleRemoveWorkordersItem = (id) => {
        this.setState((prev) => ({
            workorderItems: prev.workorderItems.filter((woi) => woi.workordersItemId !== id),
            removedWorkorderItems: prev.removedWorkorderItems.filter((woi) => woi.workordersItemId === id)
        }))
    }

    handleClientChange = (e, { value, options }) => {
        const option = options.filter((i) => i.value === value)

        if (option.length === 0) {
            this.setState(() => ({
                client: { clientId: null, name: value },
                clients: [{ key: null, text: value, value: value }, ...this.state.clients],
                toggleNewClient: true
            }))
        } else {
            this.setState(() => ({
                client: { clientId: option[0].key, name: option[0].value },
                toggleNewClient: false
            }))
        }
    }

    handleContactChange = (e, { value, options }) => {
        const option = options.filter((i) => i.value === value)

        if (option.length === 0) {

            this.setState(() => ({
                contact: { contactId: null, name: value },
                contacts: [{ key: null, text: value, value: value }, ...this.state.contacts],
                toggleNewContact: true
            }))
        } else {
            this.setState(() => ({
                contact: { contactId: option[0].key, name: option[0].value },
                toggleNewContact: false
            }))
        }
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });
        try {
            const { title, client, contact, description, toggleNewClient, toggleNewContact } = this.state

            if (toggleNewClient) {
                const newClient = await createClientOnNewWorkorder(client)
                this.setState({
                    client: { clientId: newClient.clientId, name: newClient.name }
                })
            }

            if (toggleNewContact) {
                const newContact = await createContactOnNewWorkorder(this.state.client.clientId, contact)
                this.setState({ contact: { contactId: newContact.contactId, name: newContact.name } })
            } else if (toggleNewClient && contact !== null) {
                const fullContact = await getContactById(contact.contactId)
                await addClientToContact(fullContact, client.clientId)
            }

            await updateWorkorder(this.state);
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    handleDelete = async event => {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this workorder?"
        );

        if (!confirmed) {
            return;
        }

        this.setState({ isDeleting: true });

        try {
            await deleteWorkorder(this.props.match.params.id);
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isDeleting: false });
        }
    }


    render() {
        if (this.state.isLoading) {
            return <LoadingStatus />
        }
        const { title, client, contact, description } = this.state
        console.log('Edit: ', this.state)
        return (
            <div className='container'>
                {!this.state.isLoading &&
                    <form onSubmit={this.handleSubmit}>
                        <Segment>
                            <h3>Workorder Details</h3>
                            <div className='form-group'>
                                <label htmlFor='title'>Job Title</label>
                                <input
                                    className='form-control'
                                    onChange={this.handleChange}
                                    value={title}
                                    name='title'
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor='description'>Description</label>
                                <textarea
                                    className='form-control'
                                    onChange={this.handleChange}
                                    value={description}
                                    type='textarea'
                                    name='description'
                                    rows='3'
                                ></textarea>
                            </div>
                        </Segment>
                        <Segment>
                            <h3>Client Detail:</h3>
                            <div className='row'>
                                <div className='col'>
                                    <label htmlFor='client'>Client Name</label>
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
                                <div className='col'>
                                    <label htmlFor='contact'>Client Name</label>
                                    <Dropdown
                                        className='form-control'
                                        name='contact'
                                        placeholder='Search contact list...'
                                        search
                                        selection
                                        allowAdditions
                                        additionLabel='Create new contact: '
                                        options={this.state.contacts}
                                        value={contact.name}
                                        onChange={this.handleContactChange}
                                    />
                                </div>
                            </div>
                        </Segment>
                        <div>
                            <h3>Items:</h3>
                            <WorkordersItemsFormsList
                                workorderItemsList={this.state.workorderItems}
                                addWorkordersItem={this.handleAddWorkordersItem}
                                removeWorkordersItem={this.handleRemoveWorkordersItem}
                                updateWorkordersItem={this.handleUpdateWorkordersItem}
                            />
                        </div>
                        <button
                            style={{ marginRight: '10px' }}
                            className='btn btn-primary'
                            disabled={!this.validateForm()}
                            type='submit'
                        >Save</button>
                        <button
                            className='btn btn-danger'
                            onClick={this.handleDelete}
                        >Delete</button>
                    </form>}
            </div>
        )
    }
}