import React, { Component } from 'react'
import AddressForm from './AddressForm'
import { Button } from 'semantic-ui-react'
import uuid from 'uuid'

export default class AddressFormList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            toggleAddButton: false
        }
    }

    componentDidMount() {
        this.addToList()
    }

    handleToggleButton = () => {
        this.setState({ toggleAddButton: true })
    }

    removeFromList = (id) => {
        this.setState((prev) => ({
            list: prev.list.filter((item) => item.id !== id)
            
        }))
    }

    addToList = () => {
        const id = uuid.v1()
        const element = {
            component: <AddressForm
                addAddress={this.props.addAddress}
                removeAddress={this.props.removeAddress}
                removeComponent={this.removeFromList}
                showAddButton={this.handleToggleButton}
                id={id}
            />,
            id: id
        }
        this.setState((prev) => ({
            list: prev.list.concat(element),
            count: prev.count + 1,
            toggleAddButton: false
        }))
    }

    render() {
        const { list, toggleAddButton } = this.state
        return (
            <div>
                {list.map((address) => {
                    return (
                        <div
                            style={{ marginBottom: '10px' }}
                            key={address.id}>
                            {address.component}
                        </div>
                    )
                })}
                {toggleAddButton &&
                    <Button
                        primary
                        content='Add Another Address'
                        onClick={this.addToList}
                    />}
            </div>
        )
    }
}