import React, { Component } from 'react'
import { Dropdown, Segment } from 'semantic-ui-react'
import { createClient, getClientById, updateClient } from '../../api/clients'
import { clientTypes } from '../../utils/typeLists/clientTypes'

export default class ClientForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            mode: '',
            name: '',
            type: '',
            email: '',
        }
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return
        }

        const { match } = this.props
        if (match.path === '/clients/new') {
            this.setState({ mode: 'new' })
        } else {
            const client = await getClientById(this.props.match.params.id)
            this.setState(() => ({
                mode: 'edit',
                name: client.name,
                type: client.type,
                email: client.email
            }))
        }
    }

    validateForm() {
        const { name, type } = this.state
        return name.length > 0
            && type.length > 0
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    handleSelectChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({ isLoading: true })
        if (this.state.mode === 'edit') {
            this.editClient()
        } else {
            this.newClient()
        }
    }

    newClient = async () => {
        try {
            const client = await createClient(this.state)
            if (this.props.location.state.fromWorkorder === true) {
                this.props.history.push(`/workorders/${this.props.location.state.workorderId}`)
            } else {
                this.props.history.push(`/clients/${client.clientId}`)
            }
        } catch (e) {
            alert(e)
            this.setState({ isLoading: false })
        }
    }

    editClient = async () => {
        await updateClient(this.state, this.props.match.params.id)
        if (this.props.location.state.fromWorkorder === true) {
            this.props.history.push(`/workorders/${this.props.location.state.workorderId}`)
        } else {
            this.props.history.push(`/clients/${this.props.match.params.id}`)
        }
    }

    render() {
        const { name, type, email } = this.state
        return (
            <Segment>
                <form onSubmit={this.handleSubmit} className='container'>
                    <h3>Client Details</h3>
                    <div className='form-group'>
                        <label>Client Name:</label>
                        <input
                            className='form-control'
                            name='name'
                            value={name}
                            placeholder='Enter client name'
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Client Type:</label>
                        <Dropdown
                            className='form-control'
                            name='type'
                            placeholder='Pick client type'
                            search
                            selection
                            options={clientTypes}
                            value={type}
                            onChange={this.handleSelectChange}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Client email:</label>
                        <input
                            className='form-control'
                            name='email'
                            value={email}
                            placeholder='Enter client email'
                            onChange={this.handleChange}
                        />
                    </div>
                    <button
                        className='btn btn-primary'
                        disabled={!this.validateForm()}
                        type="submit"
                    >Save</button>
                </form>
            </Segment>
        )
    }
}