import React, { Component } from 'react'
import PhoneForm from './PhoneForm'
import { Button } from 'semantic-ui-react'
import uuid from 'uuid'


export default class PhoneInputList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            toggleAddButton: false,
        }
    }

    componentDidMount() {
        this.addToList()
    }

    handleToggleButton = () => {
        this.setState({ toggleAddButton: true })
    }

    addToList = () => {
        const id = uuid.v1()
        const element = {
            component: <PhoneForm
                addPhoneNumber={this.props.addPhoneNumber}
                removePhoneNumber={this.props.removePhoneNumber}
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

    removeFromList = (id) => {
        this.setState((prev) => ({
            list: prev.list.filter((item) => item.id !== id)
        }))
    }

    render() {
        const { list, toggleAddButton } = this.state

        return (
            <div>
                {list.map((phoneInput) => {
                    return (
                        <div
                            style={{ marginBottom: '10px' }}
                            key={phoneInput.id}>
                            {phoneInput.component}
                        </div>
                    )
                })}
                {toggleAddButton &&
                    <Button
                        primary
                        content='Add Another Number'
                        onClick={this.addToList}
                    />}
            </div>
        )
    }
}