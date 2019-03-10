import React, { Component } from 'react'
import { Segment, List } from 'semantic-ui-react'

export default class ClientListItem extends Component {
    render() {
        const { client } = this.props
        return (
            <Segment>
                <List>
                    <List.Header>{`Client: ${client.name}`}</List.Header>
                    <span>Contacts:</span>
                    {client.contacts.map((contact) => {
                        return <div key={contact.contactId}>{contact.name}</div>
                    })}
                </List>
            </Segment>
        )
    }
}