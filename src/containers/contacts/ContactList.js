import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ContactList extends Component {
    render(){
        return(
            <div>
                Contact List
                <Link to='/contacts/new' className='btn btn-primary'>
                    New Contact
                </Link>
            </div>
        )
    }
}