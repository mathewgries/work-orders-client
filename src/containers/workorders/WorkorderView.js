import React, { Component } from 'react'
import LoadingStatus from '../../components/LoadingStatus'
import { Segment, List, Table, Card, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { getWorkorderById } from '../../api/workorders'
import './WorkordersView.css'

/*
    Load workorderItems
    Add button to create a new workorderItem

    Hook up the client and contact forms
*/

class WorkorderItemsTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            overallTotal: 0
        }
    }

    componentDidMount() {
        const { workorderItems } = this.props
        const getTotals = workorderItems.map((item) => item.total)
        const overallTotal = getTotals.reduce((total, amount) => total + amount)

        this.setState({ overallTotal })
    }

    render() {
        const { workorderItems } = this.props

        return (
            <div>

            </div>
            // <Table celled>
            //     <Table.Header>
            //         <Table.Row>
            //             <Table.HeaderCell>Type</Table.HeaderCell>
            //             <Table.HeaderCell>Description</Table.HeaderCell>
            //             <Table.HeaderCell>Quanity</Table.HeaderCell>
            //             <Table.HeaderCell>Price</Table.HeaderCell>
            //             <Table.HeaderCell>Total</Table.HeaderCell>
            //         </Table.Row>
            //     </Table.Header>
            //     <Table.Body>
            //         {workorderItems.map((workorderItem) => {
            //             return (
            //                 <Table.Row key={workorderItem.workordersItemId}>
            //                     <Table.Cell>{workorderItem.workordersItemType}</Table.Cell>
            //                     <Table.Cell>{workorderItem.description}</Table.Cell>
            //                     <Table.Cell>{workorderItem.quanity}</Table.Cell>
            //                     <Table.Cell>{workorderItem.unitPrice}</Table.Cell>
            //                     <Table.Cell>{workorderItem.total}</Table.Cell>
            //                 </Table.Row>
            //             )
            //         })}
            //         <Table.Row>
            //             <Table.Cell colSpan='4'><Label ribbon>Total</Label></Table.Cell>
            //             <Table.Cell>{this.state.overallTotal}</Table.Cell>
            //         </Table.Row>
            //     </Table.Body>
            // </Table >
        )
    }
}

export default class WorkorderView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            workorder: {},
        }
    }

    async componentDidMount() {

        try {
            const workorder = await getWorkorderById(this.props.match.params.id)
            this.setState(() => ({
                workorder,
            }))
        } catch (e) {
            alert(e)
        }

        this.setState({ isLoading: false })
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingStatus />
        }
        const { title, description } = this.state.workorder
        return (
            <div className='container'>
                <Card.Group className='row justify-content-center justify-content-md-center justify-content-lg-between'>
                    <Card className='col-12 col-md-5 col-lg-3'>
                        <Card.Content>
                            <Card.Header as='h3'>{title}</Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Card.Header as='h5'>Description:</Card.Header>
                            <div>
                                {description}
                            </div>
                            <div>
                                <Link
                                    to={`/workorders/edit/${this.props.match.params.id}`}
                                    className='btn btn-success'>
                                    Edit Details
                                </Link>
                            </div>
                        </Card.Content>
                    </Card>
                    <Card className='col-12 col-md-5 col-lg-3'>
                        <Card.Content>
                            <Card.Header as='h4'>Client Info:</Card.Header>
                            {this.state.workorder.clientId === undefined
                                ? <div>
                                    <Link
                                        to={{
                                            pathname: '/clients/new',
                                            state: {
                                                fromWorkorder: true,
                                                workorderId: this.props.match.params.id
                                            }
                                        }}
                                        className='btn btn-success'>
                                        Add Client
                                    </Link>
                                </div>
                                : <div>
                                    <Link
                                        to={{
                                            pathname: `/clients/edit/${this.state.workorder.clientId}`,
                                            state: {
                                                fromWorkorder: true,
                                                workorderId: this.props.match.params.id
                                            }
                                        }}
                                        className='btn btn-success'>
                                        Edit Client
                                </Link>
                                </div>}
                        </Card.Content>
                        <Card.Content>
                            <Card.Header as='h5'>Contact:</Card.Header>
                            {this.state.workorder.contactId === null
                                ? <div>
                                    <Link
                                        to={{
                                            pathname: `/contacts/new`,
                                            state: {
                                                fromWorkorder: true,
                                                workorderId: this.props.match.params.id
                                            }
                                        }}
                                        className='btn btn-success'>
                                        Add Contact
                                    </Link>
                                </div>
                                : <div>
                                    <Link
                                        to={{
                                            pathname: `/contacts/edit/${this.state.workorder.clientId}`,
                                            state: {
                                                fromWorkorder: true,
                                                workorderId: this.props.match.params.id
                                            }
                                        }}
                                        className='btn btn-success'>
                                        Edit Contact
                                    </Link>
                                </div>}
                        </Card.Content>
                    </Card>
                    <Card className='col-12 col-md-5 col-lg-3'>
                        <Card.Content>
                            <p>{'Start Date:'}</p>
                            <p>{'Finish Date:'}</p>
                        </Card.Content>
                    </Card>
                </Card.Group>
                <pre>{JSON.stringify(this.state.workorderItems, null, 2)}</pre>
            </div>
        )
    }
}