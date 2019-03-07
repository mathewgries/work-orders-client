import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { API } from 'aws-amplify'

export default class ClientList extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            clients: [],
        }
    }

    async componentDidMount(){
        if(!this.props.isAuthenticated){
            return
        }

        try{
            const clients = await this.clients()
            this.setState({clients})
        } catch (e) {
            alert(e)
        }
    }

    clients(){
        return API.get('clients', '/clients')
    }

    render() {
        return (
            <div>
                <h1>Client List</h1>
                <div>
                <Link to='/clients/new' className='btn btn-primary'>Add Client</Link>
                </div>
                <pre>{JSON.stringify(this.state.clients, null, 2)}</pre>

            </div>
        )
    }
}