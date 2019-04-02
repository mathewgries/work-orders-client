import React, { Component } from 'react'
import { createContact } from '../../api/contacts'
import { Dropdown, Segment } from 'semantic-ui-react'
import LoadingStatus from '../../components/LoadingStatus'
import './NewContact.css'

/*
    TODO: ADD UPDATES TO PHONE TABLE AND CLIENT TABLE
*/

const preferredMethods = [
    { text: 'Home', value: 'Home' },
    { text: 'Cell', value: 'Cell' },
    { text: 'Email', value: 'Email' },
    { text: 'Fax', value: 'Fax' }
]

export default class NewContact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: '',
            isLoading: false,
            name: '',
            email: '',
            preferredContactMethod: null,
        }
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return
        }
        this.setState({ mode: 'new' })
    }

    validateForm() {
        return this.state.name.length > 0
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    handleSelectChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    handleSubmit = async (e) => {
        e.preventDefault(e)

        this.setState({ isLoading: true });
        try {
            await createContact(this.state)
        } catch (e) {
            alert(e)
            this.setState({ isLoading: false });
        }
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingStatus />
        }

        const { name, email, preferredContactMethod } = this.state
        return (
            <Segment>
                <form onSubmit={this.handleSubmit} className='container'>
                <h3>Contact Details</h3>
                    <div>
                        <div className='form-group'>
                            <label>Contact Name:</label>
                            <input
                                className='form-control'
                                name='name'
                                value={name}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Email:</label>
                            <input
                                className='form-control'
                                type='email'
                                name='email'
                                value={email}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Preferred Contact Method:</label>
                            {/* Replace with select element */}
                            <Dropdown
                                className='form-control'
                                name='preferredContactMethod'
                                placeholder={`Contact's preffered contact method...`}
                                search
                                selection
                                options={preferredMethods}
                                value={preferredContactMethod}
                                onChange={this.handleSelectChange}
                            />
                        </div>
                    </div>
                    <button
                        className='btn btn-primary'
                        disabled={!this.validateForm()}
                        type="submit"
                    >Save
                </button>
                </form >
            </Segment>
        )
    }
}