import React, { Component } from 'react'
import { Segment, Header, List, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './WorkordersView.css'
import { API } from 'aws-amplify'

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

    loadContact(id){
        return API.get('contacts', '/contacts')
            .then((contacts) => contacts.filter((contact) => contact.contactId === id))
    }

    getPhonenumberList(){
        const { contact } = this.state
        if(contact.phonenumbers.length === 0){
            return <p>{'No numbers listed'}</p>
        }else {
            contact.phoneumbers.map((pn) =>{
                return (
                    <div>
                        
                    </div>
                )
            })
        }
    }

    formatWorkorderItem(workorderItem){
        return (
            <Segment key={workorderItem.workordersItemId}>
                <List.Item>
                    <span className='list-title'>Type:</span> {workorderItem.workordersItemtype}
                    <span className='list-title'>Description:</span> {workorderItem.description}
                    <span className='list-title'>Quanity:</span> {workorderItem.quanity}
                    <span className='list-title'>UnitPrice:</span> {workorderItem.unitPrice}
                </List.Item>
            </Segment>
        )
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        const { workorder, workorderItems, contact} = this.state
        const { title, client, description } = workorder

        return (
            <div>
                <Segment>
                    <Header as='h3'>{title}</Header>
                    <Link to={`/workorders/edit/${this.props.match.params.id}`} className='btn btn-primary'>Edit</Link>
                    <List>
                        <List.Item><span className='list-title'>Client:</span> {client.name}</List.Item>
                        <List.Item><span className='list-title'>Contact:</span> {contact.name}</List.Item>
                        <List.Item><span className='list-title'>Phone:</span> {this.getPhonenumberList()}</List.Item>
                        <List.Item><span className='list-title'>Email:</span> {contact.email === null ? 'N/A' : contact.email}</List.Item>
                        <List.Header as='h3'>Description</List.Header>
                        <List.Item>{description}</List.Item>
                    </List>
                </Segment>
                <List>
                    {workorderItems.map((item) => this.formatWorkorderItem(item))}
                </List>
                <pre>{JSON.stringify(this.state.workorder, null, 2)}</pre>
                <pre>{JSON.stringify(this.state.contact, null, 2)}</pre>
                <pre>{JSON.stringify(this.state.workorderItems, null, 2)}</pre>
            </div>
        )
    }
}