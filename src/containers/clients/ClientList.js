import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import LoadingStatus from '../../components/LoadingStatus'
import { getClients } from '../../api/clients'
import { getContacts } from '../../api/contacts'
import './Clients.css'

export default class ClientList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            clients: [],
            contacts: []
        }
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return
        }

        try {
            const clients = await getClients()
            const contacts = await getContacts()
            this.setState({ clients, contacts })
        } catch (e) {
            alert(e.message)
        }

        this.setState({ isLoading: false })
    }

    matchContacts(clientId) {
        return this.state.contacts.filter((contact) =>
            contact.clientId === clientId
        ).map((contact) => contact.name)
    }

    renderClientsList() {
        return this.state.clients.map((client) =>
            <div key={client.clientId} className='main-list-item'>
                <Link to={`/clients/${client.clientId}`}>
                    <h5>{`Client:`}</h5>
                    {client.name}
                    <h5>{`Contacts:`}</h5>
                    {this.matchContacts(client.clientId)}
                </Link>
            </div>
        );
    }

    renderClients() {
        return (
            <div className="clients container">
                <h1>Your Clients</h1>
                <hr />
                <Link to={{
                    pathname: '/clients/new',
                    state: {
                        fromWorkorder: false,
                        workorderId: null
                    }
                }}><h4><b>{"\uFF0B"}</b> Create a new client</h4></Link>
                <div className='main-list'>
                    {!this.state.isLoading && this.renderClientsList(this.state.clients)}
                </div>
            </div>
        );
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingStatus />
        }
        return (
            <div>{this.renderClients()}</div>
        )
    }
}