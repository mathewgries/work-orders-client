import React, { Component } from 'react'
import { Form, Input } from 'semantic-ui-react'

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
            name: '',
            contact: null,
            contactId: null,
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    handleSelectChange = (e, { value }) => {
        const selected = arrayOfOptions.filter((opt) => {
            return opt.value === value
        })

        console.log(selected)
        this.setState({ 
            contact: value,
            contactId: selected[0].key
        })
    }

    render() {
        const { name, contact } = this.state
        return (
            <div>
                <Form>
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
                        <Form.Field>
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
                        </Form.Field>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}