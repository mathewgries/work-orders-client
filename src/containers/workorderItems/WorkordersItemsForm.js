import React, { Component } from 'react'
import { Form, Input, Segment, TextArea, Dropdown, Button } from 'semantic-ui-react'
import { currencyRounder } from '../../utils/currencyRounder'

const workordersItemTypes = [
    { text: 'labor', value: 'labor' },
    { text: 'part', value: 'part' },
    { text: 'tool', value: 'tool' },
    { text: 'miscellaneous', value: 'miscellaneous' }
]

export default class WorkordersItemsForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
        if(name === 'quanity'){
            if(this.state.unitPrice > 0){
                this.setState({ total: currencyRounder(value, this.state.unitPrice)}) 
            }
        }
        if(name === 'unitPrice'){
            if(this.state.quanity > 0 ){
                this.setState({ total: currencyRounder(this.state.quanity, value)}) 
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

    onSubmit = (e) => {
        e.preventDefault()
        const { id, workordersItemType, description, quanity, unitPrice, total } = this.state

        this.props.addWorkordersItem({
            workordersItemId: id,
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
        return (
            <Segment>
                <Form.Group>
                    <Form.Field required>
                        <label>Type</label>
                        <Dropdown
                            selection
                            search
                            name='workordersItemType'
                            options={workordersItemTypes}
                            onChange={this.handleSelectChange}
                            value={workordersItemType}
                            disabled={submitted}
                        />
                    </Form.Field>
                    <Form.Field required>
                        <label>Quanity</label>
                        <Input
                            name='quanity'
                            value={quanity}
                            onChange={this.handleChange}
                            disabled={submitted}
                            type='number'
                        />
                    </Form.Field>
                    <Form.Field required>
                        <label>Unit Price</label>
                        <Input
                            name='unitPrice'
                            value={unitPrice}
                            onChange={this.handleChange}
                            disabled={submitted}
                            type='currency'
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Total</label>
                        <Input
                            name='total'
                            value={total}
                            onChange={this.handleChange}
                            disabled={true}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Field>
                    <label>Description</label>
                    <TextArea
                        name='description'
                        value={description}
                        onChange={this.handleChange}
                        disabled={submitted}
                    />
                </Form.Field>
                {!submitted
                    ? <Button
                        positive
                        content='Save'
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