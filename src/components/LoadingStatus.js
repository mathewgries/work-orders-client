import React, { Component } from 'react'

export default class LoadingStatus extends Component {
    render(){
        return(
            <div style={style.contain}>
                <h1 style={style.header}>Loading...</h1>
            </div>
        )
    }
}

const style = {
    contain: {
        width: '100%',
        alignContent: 'center'
    },
    header: {
        margin: '100px auto'
    }
}