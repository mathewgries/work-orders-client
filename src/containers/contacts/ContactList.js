import React, { Component, Fragment } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { List, Segment, Header } from 'semantic-ui-react'
import { API } from 'aws-amplify'

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
            const contacts = await this.loadContacts()
            const clients = await this.loadClients()

            this.setState({ contacts, clients })
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    loadContacts() {
        return API.get('contacts', '/contacts')
    }

    loadClients() {
        return API.get('clients', '/clients')
    }

    getClientName(contact) {
        const client = this.state.clients.filter((client) => client.clientId === contact.clientId)
        return client[0].name
    }

    renderContactsList(contacts) {
        return [{}].concat(contacts).map(
            (contact, i) =>
                i !== 0
                    ? <Segment key={contact.contactId}>
                        <LinkContainer to={`/contacts/${contact.contactId}`}>
                            <List.Item>
                                <List.Header>{`Contact: ${contact.name}`}</List.Header>
                                {`Client:  ${this.getClientName(contact)}`} <br />
                                {"Created: " + new Date(contact.createdAt).toLocaleString()}
                            </List.Item>
                        </LinkContainer>
                    </Segment>
                    : <LinkContainer key="new" to="/contacts/new">
                        <List.Item><h4><b>{"\uFF0B"}</b> Create a new contacts</h4></List.Item>
                    </LinkContainer>
        );
    }

    renderContacts() {
        return (
            <div className="contacts">
                <Header as='h1'>Your Contact</Header>
                <hr />
                <List>
                    {!this.state.isLoading && this.renderContactsList(this.state.contacts)}
                </List>
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