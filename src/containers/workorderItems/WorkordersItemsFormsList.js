import React, { Component } from 'react'
import WorkordersItemsForm from './WorkordersItemsForm'
import { Button } from 'semantic-ui-react'
import uuid from 'uuid'

export default class WorkordersItemsFormsList extends Component {
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
            component: <WorkordersItemsForm
                addWorkordersItem={this.props.addWorkordersItem}
                removeWorkordersItem={this.props.removeWorkordersItem}
                removeComponent={this.removeFromList}
                showAddButton={this.handleToggleButton}
                id={id}
            />,
            id: id
        }
        this.setState((prev) => ({
            list: prev.list.concat(element),
            toggleAddButton: false
        }))
    }

    render() {
        const { list, toggleAddButton } = this.state
        return (
            <div>
                {list.map((workordersItem) => {
                    return (
                        <div
                            style={{ marginBottom: '10px' }}
                            key={workordersItem.id}>
                            {workordersItem.component}
                        </div>
                    )
                })}
                {toggleAddButton &&
                    <button
                        style={{marginBottom: '10px'}}
                        className='btn btn-primary'
                        onClick={this.addToList}
                    >Add Another Item</button>}
            </div>
        )
    }
}