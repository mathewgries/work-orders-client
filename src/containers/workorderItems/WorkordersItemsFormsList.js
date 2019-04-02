import React, { Component } from 'react'
import WorkordersItemsForm from './WorkordersItemsForm'
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
        if (this.props.workorderItemsList.length !== 0) {
            this.props.workorderItemsList.map((woi) => {
                return this.loadWorkorderItemForEdit(woi)
            })
            this.setState({toggleAddButton: true})
        } else {
            this.addToList()
        }
    }

    handleToggleButton = () => {
        this.setState({ toggleAddButton: true })
    }

    updateComonent = (workorderItem) => {
        const listWithUpdatedItem = this.state.list.map((item) => {
            if(item.id === workorderItem.workordersItemId){
                return {
                    id: workorderItem.workordersItemId,
                    workordersItemType: workorderItem.workordersItemType,
                    description: workorderItem.description,
                    quanity: workorderItem.quanity,
                    unitPrice: workorderItem.unitPrice,
                    total: workorderItem.total
                }
            } else {
                return item
            }
        })
        this.setState((prev) => ({
            list: listWithUpdatedItem
        }))
    }

    removeFromList = (id) => {
        if (this.state.list.length === 1) {
            this.addToList()
        }
        this.setState((prev) => ({
            list: prev.list.filter((item) => item.id !== id)
        }))
    }

    loadWorkorderItemForEdit(woi) {
        const element = {
            component: <WorkordersItemsForm
                workorderItem={woi}
                addWorkordersItem={this.props.addWorkordersItem}
                removeWorkordersItem={this.props.removeWorkordersItem}                
                removeComponent={this.removeFromList}
                updateWorkordersItem={this.props.updateWorkordersItem}
                updateComonent={this.updateComponent}
                showAddButton={this.handleToggleButton}
                id={woi.workordersItemId}
            />,
            id: woi.workordersItemId
        }
        this.setState((prev) => ({
            list: prev.list.concat(element)
        }))
    }

    addToList = () => {
        const id = uuid.v1()
        const element = {
            component: <WorkordersItemsForm
                workorderItem={null}
                addWorkordersItem={this.props.addWorkordersItem}
                removeWorkordersItem={this.props.removeWorkordersItem}
                removeComponent={this.removeFromList}
                updateWorkordersItem={this.props.updateWorkordersItem}
                updateComonent={this.updateComponent}
                showAddButton={this.handleToggleButton}
                id={id}
            />,
            id: id
        }
        this.setState((prev) => ({
            list: prev.list.concat(element),
            toggleAddButton: false,
        }))
    }

    render() {
        const { list, toggleAddButton } = this.state
        console.log('List: ', this.state)
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
                        style={{ marginBottom: '10px' }}
                        className='btn btn-primary'
                        onClick={this.addToList}
                    >Add Another Item</button>}
            </div>
        )
    }
}