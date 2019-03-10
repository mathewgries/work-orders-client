import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Loader, Segment, List, Header } from 'semantic-ui-react'
import { API } from 'aws-amplify'

export default class ClientList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            clients: []
        }
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return
        }

        try {
            const clients = await this.loadClients()
            this.setState({ clients })
        } catch (e) {
            alert(e.message)
        }

        this.setState({ isLoading: false })
    }

    loadClients() {
        return API.get('clients', '/clients')
    }

    renderClientsList(clients) {
        return [{}].concat(clients).map(
            (client, i) =>
                i !== 0
                    ? <Segment key={client.clientId}>
                        <LinkContainer to={`/clients/${client.clientId}`}>
                            <List.Item>
                                <List.Header>{`Client: ${client.name}`}</List.Header>
                                <span>Contacts:</span>
                                {client.contacts.map((contact) => <div key={contact.contactId}>{contact.name}</div>)}
                            </List.Item>
                        </LinkContainer>
                    </Segment>
                    : <LinkContainer key="new" to="/clients/new">
                        <List.Item><h4><b>{"\uFF0B"}</b> Create a new client</h4></List.Item>
                    </LinkContainer>
        );
    }

    renderClients() {
        return (
            <div className="clients">
                <Header as='h1'>Your Clients</Header>
                <hr />
                <List>
                    {!this.state.isLoading && this.renderClientsList(this.state.clients)}
                </List>
            </div>
        );
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        return (
            <div>{this.renderClients()}</div>
        )
    }
}