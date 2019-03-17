import React, { Component } from 'react'
import LoadingStatus from '../../components/LoadingStatus'
import { Segment, List, Table, Card, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { getWorkorderById } from '../../api/workorders'
import { getWorkorderItemsByWorkorderId } from '../../api/workordersItems'
import { getContactById } from '../../api/contacts'
import { getClientById } from '../../api/clients'
import './WorkordersView.css'

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
        )
    }
}

export default class WorkorderView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            workorder: {},
            contact: {},
            client: {},
            workorderItems: null
        }

    }

    async componentDidMount() {

        try {
            const workorder = await getWorkorderById(this.props.match.params.id)
            const workorderItems = await getWorkorderItemsByWorkorderId(workorder.workorderId)
            const contact = await getContactById(workorder.contactId)
            const client = await getClientById(workorder.clientId)
            this.setState(() => ({
                workorder,
                workorderItems,
                contact,
                client
            }))
        } catch (e) {
            alert(e)
        }

        this.setState({ isLoading: false })
    }

    getPhonenumberList() {
        const { contact } = this.state
        if (contact.phonenumbers.length > 0) {
            contact.phonenumbers.map((pn) => {
                return (
                    <div>
                        <p>{pn.phonenumberType}</p>
                    </div>
                )
            })
        } else {
            return <p>{'No numbers listed'}</p>
        }
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingStatus />
        }
        const { workorder, workorderItems, contact, client } = this.state
        const { title, description } = workorder

        return (
            <div>
                <Card.Group>
                    <Card>
                        <Card.Content>
                            <Card.Header as='h3'>{title}</Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <List>
                                <Segment>
                                    <List.Item>
                                        <Card.Header as='h5'>Client:</Card.Header>
                                        {client ? client.name : 'Attach client'}
                                    </List.Item>
                                </Segment>
                                <Segment>
                                    {!contact
                                        ? 'No contact listed'
                                        : <div>
                                            <List.Item>
                                                <Card.Header as='h5'>Contacts</Card.Header >
                                            </List.Item>
                                            <List.Item>{contact.name}</List.Item>
                                            <List.Item>{this.getPhonenumberList()}</List.Item>
                                            <List.Item>{contact.email ? contact.email : 'No email listed'}</List.Item>
                                        </div>
                                    }
                                </Segment>
                                <Link
                                    to={`/workorders/edit/${workorder.workorderId}`}
                                    className='btn btn-block btn-primary'>
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
                {workorderItems.length === 0
                    ? <div>No tems to list</div>
                    : <WorkorderItemsTable workorderItems={workorderItems} />}
            </div>
        )
    }
}