import React, { Component } from 'react'
import { Segment, Radio, Dropdown, Button } from 'semantic-ui-react'
import { abbreviatedStates } from '../../utils/abbreviatedStates'
import './Address.css'

const stateList = abbreviatedStates.sort().map((state) => {
    return {
        text: state,
        value: state
    }
})

export default class AddressForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            type: 'Billing',
            line1: '',
            line2: '',
            state: '',
            city: '',
            zipCode: '',
            zipCode4: '',
            submitted: false
        }
    }

    componentDidMount() {
        this.setState({ id: this.props.id })
    }

    validateForm() {
        const { line1, line2, state, city, zipCode } = this.state
        return line1.length > 0
            || line2.length > 0
            || state.length > 0
            || city.length > 0
            || zipCode.length > 0
    }

    handleRadioToggle = (e, { value }) => {
        this.setState({ type: value })
    }

    handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    handleStateChange = (e, { value }) => {
        e.preventDefault()
        this.setState({ state: value })
    }

    onDelete = (e) => {
        e.preventDefault()
        this.props.removeAddress(this.state.id)
        this.props.removeComponent(this.state.id)
    }

    onSubmit = (e) => {
        e.preventDefault()
        const { id, line1, line2, city, state, zipCode, zipCode4, type } = this.state

        this.props.addAddress({
            addressType: type,
            line1,
            line2: line2 || null,
            city,
            state,
            zipCode,
            zipCode4: zipCode4 || null,
            addressId: id
        })

        this.setState({ submitted: true })
        this.props.showAddButton()
    }

    render() {
        const { line1, line2, city, state, zipCode, zipCode4, type, submitted } = this.state
        return (
            <Segment>
                <label>Address Type:</label>
                <div className='form-group'>
                    <Radio
                        className='radio'
                        label='Billing'
                        name='type'
                        value='Billing'
                        checked={type === 'Billing'}
                        onChange={this.handleRadioToggle}
                        disabled={submitted}
                    />
                    <Radio
                        className='radio'
                        label='Mailing'
                        name='type'
                        value='Mailing'
                        checked={type === 'Mailing'}
                        onChange={this.handleRadioToggle}
                        disabled={submitted}
                    />
                    <Radio
                        className='radio'
                        label='Other'
                        name='type'
                        value='Other'
                        checked={type === 'Other'}
                        onChange={this.handleRadioToggle}
                        disabled={submitted}
                    />
                </div>
                <div className='form-group'>
                    <label>Line 1:</label>
                    <input
                        className='form-control'
                        name='line1'
                        value={line1}
                        onChange={this.handleChange}
                        disabled={submitted}
                    />
                </div>
                <div className='form-group'>
                    <label>Line 2:</label>
                    <input
                        className='form-control'
                        name='line2'
                        value={line2}
                        onChange={this.handleChange}
                        disabled={submitted}
                    />
                </div>
                <div className='form-group'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <label>State:</label>
                            <Dropdown
                                className='form-control'
                                selection
                                search
                                name='state'
                                options={stateList}
                                onChange={this.handleStateChange}
                                value={state}
                                disabled={submitted}
                            />
                        </div>
                        <div className='col-md-4'>
                            <label>City:</label>
                            <input
                                className='form-control'
                                name='city'
                                value={city}
                                onChange={this.handleChange}
                                disabled={submitted}
                            />
                        </div>
                        <div className='col-md-4'>
                            <label>Zip Code:</label>
                            <input
                                className='form-control'
                                name='zipCode'
                                value={zipCode}
                                onChange={this.handleChange}
                                disabled={submitted}
                            />
                        </div>
                        <div className='col-md-4'>
                            <label>Extension (optional)</label>
                            <input
                                className='form-control'
                                name='zipCode4'
                                value={zipCode4}
                                onChange={this.handleChange}
                                disabled={submitted}
                            />
                        </div>
                    </div>
                </div>
                {!submitted
                    ? <Button
                        positive
                        content='Add Address'
                        size='small'
                        onClick={this.onSubmit}
                        disabled={!this.validateForm()}
                    />
                    : <Button
                        negative
                        content='Remove'
                        size='small'
                        onClick={this.onDelete}
                    />
                }
            </Segment>
        )
    }
}