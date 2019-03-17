import React, { Component } from "react";
import WorkordersItemsFormsList from '../workorderItems/WorkordersItemsFormsList'
import { Dropdown } from 'semantic-ui-react'
import LoaderButton from "../../components/LoaderButton";
import { getClientsForDropDown, createClientOnNewWorkorder } from '../../api/clients'
import {
    getContactsForDropDown,
    getContactById,
    createContactOnNewWorkorder,
    addClientToContact
} from '../../api/contacts'
import { createWorkorder } from '../../api/workorders'
import { createWorkordersItem } from '../../api/workordersItems'
import { s3Upload } from '../../libs/awsLib'
import config from "../../config";
import "./NewWorkorder.css";

/*
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
            description: '',
            client: {
                clientId: null,
                name: '',
            },
            clients: [],
            contact: {
                contactId: null,
                name: ''
            },
            contacts: [],
            workorderItems: []
        };
    }

    async componentDidMount() {
        try {
            const contacts = await getContactsForDropDown()
            const clients = await getClientsForDropDown()

            this.setState({ contacts, clients })
        } catch (e) {
            alert(e)
        }

        this.setState({ isLoading: false })
    }

    validateForm() {
        const { title, description } = this.state

        return title !== ''
            && description !== ''
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        });
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

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    handleAddWorkordersItem = (newWorkorderItem) => {
        this.setState((prev) => ({
            workorderItems: prev.workorderItems.concat(newWorkorderItem)
        }))
    }

    handleRemoveWorkordersItem = (id) => {
        this.setState((prev) => ({
            workorderItems: prev.workorderItems.filter((woi) => woi.workordersItemId !== id)
        }))
    }

    handleSubmit = async event => {
        event.preventDefault();
        const { workorderItems, client, contact, toggleNewClient, toggleNewContact } = this.state

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }

        this.setState({ isLoading: true });

        try {

            const attachment = this.file
                ? await s3Upload(this.file)
                : null;


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

            const newWorkorder = await createWorkorder(attachment, this.state);

            await workorderItems.map((workorderItem) => {
                return createWorkordersItem(newWorkorder.workorderId, workorderItem)
            })

            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { title, client, contact, description } = this.state

        return (
            <form onSubmit={this.handleSubmit} className='container'>
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
                <div>
                    <label>Items:</label>
                    <WorkordersItemsFormsList
                        addWorkordersItem={this.handleAddWorkordersItem}
                        removeWorkordersItem={this.handleRemoveWorkordersItem}
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
        );
    }
}