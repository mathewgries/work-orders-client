import React, { Component } from 'react'
import { Form, Input } from 'semantic-ui-react'
import LoaderButton from '../../components/LoaderButton'
import { API } from 'aws-amplify'

const arrayOfOptions = [
    { key: '1', text: 'Jon', value: 'Jon' },
    { key: '2', text: 'Mark', value: 'Mark' },
    { key: '3', text: 'Steve', value: 'Steve' },
    { key: '4', text: 'Chris', value: 'Chris' }
]

export default class NewClient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: null,
            name: '',
        }
    }

    validateForm() {
        const { name } = this.state
        return name.length > 0
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    handleSelectChange = (e, { value }) => {
        const selected = arrayOfOptions.filter((opt) => {
            return opt.value === value
        })

        console.log(e)
        this.setState({
            contact: value,
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()

        this.setState({ isLoading: true })

        try {
            const { name } = this.state
            await this.createClient({
                content: {
                    name
                }
            })
            this.props.history.push('/clients')
        } catch (e) {
            alert(e)
            this.setState({ isLoading: false })
        }
    }

    createClient(client) {
        return API.post('clients', '/clients', {
            body: client
        })
    }

    render() {
        const { name } = this.state
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <Form.Field required>
                            <label>Client Name:</label>
                            <Input
                                fluid
                                name='name'
                                value={name}
                                placeholder='Enter client name'
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                        {/* <Form.Field>
                            <label>Contact</label>
                            <Form.Dropdown
                                clearable
                                search
                                selection
                                allowAdditions
                                placeholder='Select contact'
                                options={arrayOfOptions}
                                onChange={this.handleSelectChange}
                                value={contact}
                            />
                        </Form.Field> */}
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
                    </Form.Group>
                </Form>
            </div>
        )
    }
}