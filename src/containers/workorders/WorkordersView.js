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
        }

    }

    async componentDidMount() {
        const workorder = await this.getWorkorder()
        this.setState({
            workorder,
            isLoading: false,
        })

    }

    getWorkorder() {
        return API.get('workorders', `/workorders/${this.props.match.params.id}`)

    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        const { title, client, contact, description } = this.state.workorder
        return (
            <Segment>
                <Header as='h3'>{title}</Header>
                <Link to={`/workorders/edit/${this.props.match.params.id}`} className='btn btn-primary'>Edit</Link>
                <List>
                    <List.Item><span className='list-title'>Client:</span> {client}</List.Item>
                    <List.Item><span className='list-title'>Contact:</span> {contact}</List.Item>
                    <p>TODO: Add contact phone</p>
                    <p>TODO: Add contact alt contact info</p>
                    <List.Header as='h5'>Description</List.Header>
                    <List.Item>{description}</List.Item>
                </List>
            </Segment>
        )
    }
}