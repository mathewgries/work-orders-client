import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getClientById } from '../../api/clients'


export default class ClientView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            client: {}
        }
    }

    componentDidMount = async () => {
        if (!this.props.isAuthenticated) {
            return
        }

        try {
            const client = await getClientById(this.props.match.params.id)
            this.setState({ client })
        } catch (e) {
            alert(e)
        }
        this.setState({ isLoading: false })
    }

    render() {
        return (
            <div>
                <Link
                    className='btn btn-primary'
                    to={{
                        pathname: `/clients/edit/${this.props.match.params.id}`,
                        state: {
                            fromWorkorder: false,
                            workorderId: null
                        }
                    }}>Edit Client</Link>
                <pre>{JSON.stringify(this.state.client, null, 2)}</pre>
            </div>
        )
    }
}