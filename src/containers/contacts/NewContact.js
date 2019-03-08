import React, { Component } from 'react'
import { Form, Input, Dropdown, Button, Segment, Container } from 'semantic-ui-react'
import Cleave from 'cleave.js/react'
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.i18n'
import { countryCodes } from '../../utils/countryCodes'
import LoaderButton from '../../components/LoaderButton'
import './NewContact.css'

const preferredMethods = [
    { text: 'Home', value: 'Home' },
    { text: 'Cell', value: 'Cell' },
    { text: 'Email', value: 'Email' },
    { text: 'Fax', value: 'Fax' }
]

const phoneTypes = [
    { text: 'Home', value: 'Hom e' },
    { text: 'Cell', value: 'Cell' },
    { text: 'Office', value: 'Office' },
    { text: 'Fax', value: 'Fax' }
]

const countryCodeList = countryCodes.sort().map((cc) => {
    return <option key={cc}>{cc}</option>
})

class PhoneInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            countryCode: 'US',
            phoneNumber: '',
            phoneType: ''
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onPhoneChange = (e) => {
        console.log(e.target.value)
        console.log(e.target.rawValue)
    }

    render() {
        const { countryCode, phoneType, phoneNumber } = this.state

        return (
            <Segment className='phone-input'>
                <Form.Field className='country-code'>
                    <select
                        name='countryCode'
                        onChange={this.handleChange}
                        value={countryCode}
                    >
                        {countryCodeList}
                    </select>
                </Form.Field>

                <Form.Field>
                    <Cleave
                        className="css-phone"
                        options={{ phone: true, phoneRegionCode: countryCode }}
                        onChange={this.onPhoneChange}
                    />
                </Form.Field>

                <Form.Field>
                    <Dropdown
                        search
                        selection
                        options={phoneTypes}
                        value={phoneType}
                    />
                </Form.Field>

                <Button
                    primary
                    content='Add Phone'
                    size='medium'
                />
            </Segment>
        )
    }
}

export default class NewContact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            name: '',
            email: '',
            client: null,
            preferredMethod: null,
            phoneNumbers: [],
        }
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

    handleSubmit = (e) => {

    }

    render() {
        const { name, email, client, preferredMethod } = this.state
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Field required>
                    <label>Contact Name:</label>
                    <Input
                        name='name'
                        value={name}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Form.Group>
                    <Form.Field required>
                        <label>Phone Numbers</label>
                        <PhoneInput />
                        {/* // PHONE INPUTS GO HERE
                        // NEED MULTIPLE
                        // ADD BUTTON TO RENDER NEW PHONE FORM 
                     */}
                    </Form.Field>
                </Form.Group>
                <Form.Field>
                    <label>Email:</label>
                    <Input
                        type='email'
                        name='email'
                        value={email}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Client Relation:</label>
                    <Form.Dropdown
                        search
                        placeholder='Search client list...'
                        selection
                        onChange={this.handleSelectChange}
                        name='client'
                        value={client}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Preffered Contact Method:</label>
                    <Form.Dropdown
                        search
                        selection
                        placeholder={`Contact's preffered contact method...`}
                        options={preferredMethods}
                        onChange={this.handleSelectChange}
                        name='contactMethod'
                        value={preferredMethod}
                    />
                </Form.Field>
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
            </Form>
        )
    }
}