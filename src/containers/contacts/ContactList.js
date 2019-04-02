import React, { Component, Fragment } from 'react'
import { getClients } from '../../api/clients'
import { getContacts } from '../../api/contacts'
import { Link } from 'react-router-dom'

export default class ContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            contacts: [],
            clients: []
        }
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const contacts = await getContacts()
            const clients = await getClients()

            this.setState({ contacts, clients })
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    getClientName(contact) {
        return this.state.clients.filter((client) =>
            client.clientId === contact.clientId)
            .map((contact) => contact.name)
    }

    renderContactsList(contacts) {
        return [{}].concat(contacts).map(
            (contact, i) =>
                <div key={contact.contactId} className='main-list-item'>
                    <Link to={`/contacts/${contact.contactId}`}>
                        <h5>{`Contact: ${contact.name}`}</h5>
                        <p>{`Client:  ${this.getClientName(contact)}`}</p> <br />
                        <p>{"Created: " + new Date(contact.createdAt).toLocaleString()}</p>
                    </Link>
                </div>
        );
    }

    renderContacts() {
        return (
            <div className="contacts container">
                <h1>Your Contact</h1>
                <hr />
                <Link key="new" to="/contacts/new"><h4><b>{"\uFF0B"}</b> Create a new contact</h4></Link>
                <div className='main-list'>
                    {!this.state.isLoading && this.renderContactsList(this.state.contacts)}
                </div>
            </div>
        );
    }

    render() {
        return (
            <Fragment>
                {this.renderContacts()}
            </Fragment>
        )
    }
}