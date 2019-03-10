import React, { Component } from "react";
import { Form, Input, TextArea, Segment } from 'semantic-ui-react'
import WorkordersItemsFormsList from '../workorderItems/WorkordersItemsFormsList'
import LoaderButton from "../../components/LoaderButton";
import { API } from 'aws-amplify'
import { s3Upload } from '../../libs/awsLib'
import config from "../../config";
import uuid from 'uuid'
import "./NewWorkorder.css";

/*
    TODO: Add updates for contacts, clients, and workordersItems
    TODO: Update the contact field based off of the selected client
*/

export default class NewWorkorder extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            toggleNewClient: false,
            toggleNewContact: false,
            isLoading: true,
            title: '',
            client: {},
            clients: [],
            contact: {},
            contacts: [],
            description: '',
            workordersItems: []
        };
    }

    async componentDidMount() {
        try {
            const loadingContacts = await this.loadContacts()
            const loadingClients = await this.loadClients()

            const formattedContacts = this.formatContactList(loadingContacts)
            const formattedClients = this.formatClientList(loadingClients)
            this.setState(() => ({
                clients: formattedClients,
                contacts: formattedContacts
            }))
        } catch (e) {
            alert(e)
        }

        this.setState({ isLoading: false })
    }

    loadContacts() {
        return API.get('contacts', '/contacts')
    }

    formatContactList = (contacts) => {
        return contacts.sort().map((contact) => {
            return {
                key: contact.contactId,
                text: contact.name,
                value: contact.name,
            }
        })
    }

    loadClients() {
        return API.get('clients', '/clients')
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

    validateForm() {
        const { title, description } = this.state

        return title !== ''
            && description !== ''
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
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

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    handleAddWorkordersItem = (workordersItem) => {
        this.setState((prev) => ({
            workordersItems: prev.workordersItems.concat(workordersItem)
        }))
    }

    handleRemoveWorkordersItem = (id) => {
        this.setState((prev) => ({
            workordersItems: prev.workordersItems.filter((woi) => woi.workordersItemId !== id)
        }))
    }

    handleSubmit = async event => {
        event.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }

        this.setState({ isLoading: true });

        try {
            const { title, client, contact, description, workordersItems, toggleNewClient, toggleNewContact } = this.state
            const workorderId = uuid.v1()

            const attachment = this.file
                ? await s3Upload(this.file)
                : null;

            await this.createWorkorder({
                attachment,
                content: {
                    workorderId,
                    title,
                    client,
                    contact,
                    description
                }
            });

            if (toggleNewClient) {
                await this.createClient({
                    content: {
                        clientId: client.clientId,
                        name: client.name,
                        contact
                    }
                })
            }

            if (toggleNewContact) {
                await this.createContact({
                    content: {
                        contactId: contact.contactId,
                        name: contact.name,
                        clientId: client.clientId
                    }
                })
            }

            await workordersItems.map((woi) => {
                const { workordersItemId, workordersItemType, description, quanity, unitPrice, total } = woi
                this.createWorkordersItem({
                    content: {
                        workordersItemId,
                        workorderId,
                        clientId: client.clientId,
                        workordersItemType,
                        description,
                        quanity,
                        unitPrice,
                        total
                    }
                })
            })

            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    createWorkorder(workorder) {
        return API.post('workorders', '/workorders', {
            body: workorder
        });
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

    createWorkordersItem(workordersItem) {
        console.log('Content: ', workordersItem)
        return API.post('workordersItems', '/workordersItems', {
            body: workordersItem
        })
    }

    render() {

        const { title, client, contact, description } = this.state

        return (

            <Form onSubmit={this.handleSubmit} className='form'>
                <label>Workorder Details</label>
                <Segment>
                    <Form.Field required>
                        <label>Job Title</label>
                        <Input
                            onChange={this.handleChange}
                            value={title}
                            name='title'
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Client Name</label>
                        <Form.Dropdown
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
                    </Form.Field>
                    <Form.Field>
                        <label>Contact Name</label>
                        <Form.Dropdown
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
                    </Form.Field>
                    <Form.Field required>
                        <label>Description</label>
                        <TextArea
                            className='textarea'
                            onChange={this.handleChange}
                            value={description}
                            type='textarea'
                            name='description'
                        />
                    </Form.Field>
                </Segment>
                <Form.Field>
                    <label>Items:</label>
                    <WorkordersItemsFormsList
                        addWorkordersItem={this.handleAddWorkordersItem}
                        removeWorkordersItem={this.handleRemoveWorkordersItem}
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
        );
    }
}