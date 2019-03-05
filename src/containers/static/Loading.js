import React, { Component } from 'react'
import { Segment, Loader } from 'semantic-ui-react'

export default class Loading extends Component {

    render() {
        return (
            <Segment>
                <Loader>Loading</Loader>
            </Segment>
        )
    }
}