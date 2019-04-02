import React, { Component } from 'react'
import { Dropdown, Segment } from 'semantic-ui-react'
import { currencyRounder } from '../../utils/currencyRounder'

const workordersItemTypes = [
    { text: 'labor', value: 'labor' },
    { text: 'part', value: 'part' },
    { text: 'tool', value: 'tool' },
    { text: 'miscellaneous', value: 'miscellaneous' }
]
/*
    TODO: Allow for editing current Items that have been "saved"
*/
export default class WorkordersItemsForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editMode: false,
            id: null,
            workordersItemType: '',
            description: '',
            quanity: '',
            unitPrice: '',
            total: 0,
            submitted: false
        }
    }

    componentDidMount() {
        if (this.props.workorderItem !== null) {
            const { workordersItemId, workordersItemType, description, quanity, unitPrice, total } = this.props.workorderItem
            this.setState({
                editMode: true,
                id: workordersItemId,
                workordersItemType,
                description,
                quanity,
                unitPrice,
                total,
                submitted: true
            })
        }
        this.setState(() => ({
            id: this.props.id,
        }))
    }

    validateForm() {
        const { workordersItemType, quanity, unitPrice } = this.state
        return workordersItemType.length > 0
            && quanity !== 0
            && unitPrice !== 0
    }

    handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'quanity') {
            if (this.state.unitPrice > 0) {
                this.setState({ total: currencyRounder(value, this.state.unitPrice) })
            }
        }
        if (name === 'unitPrice') {
            if (this.state.quanity > 0) {
                this.setState({ total: currencyRounder(this.state.quanity, value) })
            }
        }

        this.setState({ [name]: value })
    }

    handleSelectChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    onDelete = (e) => {
        e.preventDefault()
        this.props.removeWorkordersItem(this.state.id)
        this.props.removeComponent(this.state.id)
    }

    handleUpdate = (e) => {
        const { id, workordersItemType, description, quanity, unitPrice, total } = this.state
        this.props.updateComponent({
            id,
            workordersItemType,
            description,
            quanity,
            unitPrice,
            total,
        })

        this.props.updateWorkordersItem({
            id,
            workordersItemType,
            description,
            quanity,
            unitPrice,
            total,
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        const { id, workordersItemType, description, quanity, unitPrice, total } = this.state

        this.props.addWorkordersItem({
            id,
            workordersItemType,
            description,
            quanity,
            unitPrice,
            total,
        })

        this.setState({ submitted: true })
        this.props.showAddButton()
    }

    render() {
        const { workordersItemType, description, quanity, unitPrice, total, submitted } = this.state
        console.log('Form: ', this.state)
        return (
            <Segment>
                <div className='row'>
                    <div className='col-md-4 form-group'>
                        <label htmlFor='workordersItemType'>Type</label>
                        <Dropdown
                            className='form-control'
                            selection
                            search
                            name='workordersItemType'
                            options={workordersItemTypes}
                            onChange={this.handleSelectChange}
                            value={workordersItemType}
                            disabled={submitted}
                        />
                    </div>
                    <div className='col-md-4 form-group'>
                        <label htmlFor='quanity'>Quanity</label>
                        <input
                            className='form-control'
                            name='quanity'
                            value={quanity}
                            onChange={this.handleChange}
                            disabled={submitted}
                            type='number'
                        />
                    </div>
                    <div className='col-md-4 form-group'>
                        <label htmlFor='unitPrice'>Unit Price</label>
                        <input
                            className='form-control'
                            name='unitPrice'
                            value={unitPrice}
                            onChange={this.handleChange}
                            disabled={submitted}
                            type='currency'
                        />
                    </div>
                    <div className='col-md-4 form-group'>
                        <label htmlFor='total'>Total</label>
                        <input
                            className='form-control'
                            name='total'
                            value={total}
                            onChange={this.handleChange}
                            disabled={true}
                        />
                    </div >
                </div>
                <div className='form-group'>
                    <label htmlFor='description'>Description</label>
                    <textarea
                        className='form-control'
                        name='description'
                        value={description}
                        onChange={this.handleChange}
                        disabled={submitted}
                        rows='3'
                    ></textarea>
                </div>
                {
                    !submitted
                        ? <button
                            className='btn btn-success'
                            onClick={this.onSubmit}
                            disabled={!this.validateForm()}
                        >Save</button>
                        : <div><button
                            style={{marginRight: '10px'}}
                            className='btn btn-danger'
                            onClick={this.onDelete}
                        >Remove</button>
                            <button
                                className='btn btn-primary'
                                onClick={this.handleUpdate}
                            >
                                Edit
                        </button>
                        </div>
                }
            </Segment >
        )
    }
}