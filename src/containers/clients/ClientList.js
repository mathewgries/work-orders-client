import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import { API } from 'aws-amplify'

export default class ClientList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            clients: [],
        }
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return
        }

        try {
            const clients = await this.clients()
            this.setState({
                clients,
                isLoading: false
            })
        } catch (e) {
            alert(e.message)
        }
    }

    clients() {
        const result = API.get('clients', '/clients')
        return result
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        return (
            <div>
                <h1>Client List</h1>
                <div>
                    <Link to='/clients/new' className='btn btn-primary'>Add Client</Link>
                </div>
                {this.state.clients.length === 0
                    ? <div>No clients added yet</div>
                    : <pre>{JSON.stringify(this.state.clients, null, 2)}</pre>}


            </div>
        )
    }
}