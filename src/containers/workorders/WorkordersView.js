import React, { Component } from 'react'
import { Card, Header, List, Loader, Table, Label } from 'semantic-ui-react'
import Loading from '../../components/Loading'
import { Link } from 'react-router-dom'
import './WorkordersView.css'
import { API } from 'aws-amplify'

class WorkorderItemsTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
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
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Descriptionr</Table.HeaderCell>
                        <Table.HeaderCell>Quanity</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                        <Table.HeaderCell>Total</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {workorderItems.map((workorderItem) => {
                        return (
                            <Table.Row key={workorderItem.workordersItemId}>
                                <Table.Cell>{workorderItem.workordersItemType}</Table.Cell>
                                <Table.Cell>{workorderItem.description}</Table.Cell>
                                <Table.Cell>{workorderItem.quanity}</Table.Cell>
                                <Table.Cell>{workorderItem.unitPrice}</Table.Cell>
                                <Table.Cell>{workorderItem.total}</Table.Cell>
                            </Table.Row>
                        )
                    })}
                    <Table.Row>
                        <Table.Cell colSpan='4'><Label ribbon>Total</Label></Table.Cell>
                        <Table.Cell>{this.state.overallTotal}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table >
        )
    }
}

export default class WorkorderView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            workorder: null,
            contact: null,
            workorderItems: []
        }

    }

    async componentDidMount() {

        try {
            const workorder = await this.loadWorkorder()
            const workorderItems = await this.loadWorkorderItems(workorder.workorderId)
            const contact = await this.loadContact(workorder.contact.contactId)
            const strippedContact = contact[0]
            this.setState({ workorder, workorderItems, contact: strippedContact })
        } catch (e) {
            alert(e)
        }

        this.setState({ isLoading: false })
    }

    loadWorkorder() {
        return API.get('workorders', `/workorders/${this.props.match.params.id}`)
    }

    loadWorkorderItems(id) {
        return API.get('workordersItems', '/workordersItems')
            .then((items) => items.filter((item) => item.workorderId === id))
    }

    loadContact(id) {
        return API.get('contacts', '/contacts')
            .then((contacts) => contacts.filter((contact) => contact.contactId === id))
    }

    getPhonenumberList() {
        const { contact } = this.state
        if (contact.phonenumbers.length === 0) {
            return <p>{'No numbers listed'}</p>
        } else {
            contact.phoneumbers.map((pn) => {
                return (
                    <div>

                    </div>
                )
            })
        }
    }

    render() {
        if (this.state.isLoading) {
            return <Loading />
        }
        const { workorder, workorderItems, contact } = this.state
        const { title, client, description } = workorder

        return (
            <div>
                <Card.Group>
                    <Card>
                        <Card.Content>
                            <Card.Header as='h3'>{title}</Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <List>
                                <List.Item><span className='list-title'>Client:</span> {client.name}</List.Item>
                                <List.Item><span className='list-title'>Contact:</span> {contact.name}</List.Item>
                                <List.Item><span className='list-title'>Phone:</span> {this.getPhonenumberList()}</List.Item>
                                <List.Item><span className='list-title'>Email:</span> {contact.email === null ? 'N/A' : contact.email}</List.Item>
                                <Link
                                    to={`/workorders/edit/${workorder.workorderId}`}
                                    className='btn btn-primary'
                                >
                                    Edit
                                </Link>
                            </List>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Card.Header as='h4'>Description</Card.Header>
                            <Card.Description>
                                {description}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <List>
                                <List.Item>
                                    {'Start Date:'}
                                </List.Item>
                                <List.Item>
                                    {'Finish Date:'}
                                </List.Item>
                            </List>
                        </Card.Content>
                    </Card>
                </Card.Group>
                <WorkorderItemsTable workorderItems={workorderItems} />
            </div>
        )
    }
}