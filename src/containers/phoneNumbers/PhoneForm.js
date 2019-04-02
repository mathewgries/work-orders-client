import React, { Component } from 'react'
import { Dropdown, Segment } from 'semantic-ui-react'
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
            <Segment>
                <div className='row phone-input'>
                    <div className='col-md-2 form-group'>
                        <label>Country:</label>
                        <select
                            className='country-code form-control'
                            name='countryCode'
                            onChange={this.handleChange}
                            value={countryCode}
                            disabled={submitted}
                        >
                            {
                                countryCodes.sort().map((cc) => {
                                    return <option key={cc}>{cc}</option>
                                })}
                        </select>
                    </div>
                    <div className='col-md-3 form-group'>
                        <label>Phone Number:</label>
                        <Cleave
                            className="css-phone form-control"
                            options={{ phone: true, phoneRegionCode: countryCode }}
                            onChange={this.onPhoneChange}
                            disabled={submitted}
                        />
                    </div>
                    <div className='col-3 form-group'>
                        <label>Phone Type:</label>
                        <Dropdown
                            className='form-control'
                            search
                            selection
                            name='phoneType'
                            options={phoneTypes}
                            onChange={this.onPhoneTypeChange}
                            value={phoneType}
                            disabled={submitted}
                        />
                    </div>
                </div>
                {!submitted
                    ? <button
                        className='btn btn-success'
                        onClick={this.onSubmit}
                        disabled={!this.validateForm()}
                    >Save</button>
                    : <button
                        className='btn btn-danger'
                        onClick={this.onDelete}
                    >Remove</button>
                }
            </Segment>
        )
    }
}