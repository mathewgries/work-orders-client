import React, { Component } from 'react'
import { Form, Dropdown, Button, Segment } from 'semantic-ui-react'
import Cleave from 'cleave.js/react'
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.i18n'
import { countryCodes } from '../../utils/countryCodes'
import './PhoneForm.css'

/*
    TODO: See if phoneTypes list can be passed in as prop (customized for parent commponent needs)
*/
const phoneTypes = [
    { text: 'Home', value: 'Home' },
    { text: 'Cell', value: 'Cell' },
    { text: 'Office', value: 'Office' },
    { text: 'Fax', value: 'Fax' }
]

const countryCodeList = countryCodes.sort().map((cc) => {
    return <option key={cc}>{cc}</option>
})

export default class PhoneForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            countryCode: 'US',
            phonenumber: '',
            rawValue: '',
            phoneType: 'Home',
            submitted: false,
        }
    }

    componentDidMount() {
        this.setState({ id: this.props.id })
    }

    validateForm() {
        const { phonenumber, phoneType } = this.state
        return phonenumber.length > 0 && phoneType.length > 0
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onPhoneTypeChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    onPhoneChange = (e) => {
        const { value, rawValue } = e.target

        this.setState({
            phonenumber: value,
            rawValue: rawValue
        })
    }

    onDelete = (e) => {
        this.props.removePhonenumber(this.state.id)
        this.props.removeComponent(this.state.id)
    }

    onSubmit = (e) => {
        e.preventDefault()
        const { phoneType, rawValue, countryCode, id } = this.state

        this.props.addPhoneNumber({
            phoneType: phoneType,
            phonenumber: rawValue,
            countryCode: countryCode,
            phonenumberId: id
        })

        this.props.showAddButton()

        this.setState({ submitted: true })
    }

    render() {
        const { countryCode, phoneType, submitted } = this.state

        return (
                <Segment className='phone-input'>
                    <Form.Field>
                        <label>Country:</label>
                        <select
                            className='country-code'
                            name='countryCode'
                            onChange={this.handleChange}
                            value={countryCode}
                            disabled={submitted}
                        >
                            {countryCodeList}
                        </select>
                    </Form.Field>

                    <Form.Field required>
                        <label>Phone Number</label>
                        <Cleave
                            className="css-phone"
                            options={{ phone: true, phoneRegionCode: countryCode }}
                            onChange={this.onPhoneChange}
                            disabled={submitted}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Phone Type:</label>
                        <Dropdown
                            search
                            selection
                            name='phoneType'
                            options={phoneTypes}
                            onChange={this.onPhoneTypeChange}
                            value={phoneType}
                            disabled={submitted}
                        />
                    </Form.Field>
                    {!submitted
                        ? <Button
                            className='add-btn'
                            positive
                            content='Save'
                            size='small'
                            onClick={this.onSubmit}
                            disabled={!this.validateForm()}
                        />
                        : <Button
                            className='add-btn'
                            negative
                            content='Delete'
                            size='small'
                            onClick={this.onDelete}
                        />
                    }
                </Segment>
        )
    }
}