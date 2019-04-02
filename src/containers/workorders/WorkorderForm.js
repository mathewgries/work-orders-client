import React, { Component } from "react";
import LoadingStatus from '../../components/LoadingStatus'
import { Segment } from 'semantic-ui-react'
import { createWorkorder, updateWorkorder, getWorkorderById } from '../../api/workorders'
import "./NewWorkorder.css";

export default class WorkorderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            mode: '',
            title: '',
            description: '',
        };
    }

    componentDidMount = async () => {
        if (this.props.match.path !== '/workorders/new') {
            try {
                const workorder = await getWorkorderById(this.props.match.params.id)
                this.setState(() => ({
                    mode: 'edit',
                    title: workorder.title,
                    description: workorder.description
                }))
            } catch (e) {
                alert(e)
            }
        }
        this.setState({ isLoading: false })
    }

    validateForm() {
        const { title, description } = this.state

        return title !== ''
            && description !== ''
    }

    handleChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.setState({ isLoading: true })
        if(this.state.mode === 'edit'){
            this.updateWorkorder()            
        }else {
            this.newWorkorder()
        }
    }

    newWorkorder = async () => {
        try {
            await createWorkorder(this.state)
                .then((workorder) => {
                    this.props.history.push(`/workorders/${workorder.workorderId}`)
                })
        } catch (e) {
            this.setState({ isLoading: false })
            alert(e)
        }
    }

    updateWorkorder = async () => {
        try {
            await updateWorkorder(this.state, this.props.match.params.id)
                .then(() => {
                    this.props.history.push(`/workorders/${this.props.match.params.id}`)
                })
        } catch (e) {
            this.setState({ isLoading: false })
            alert(e)
        }
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingStatus />
        }
        const { title, description } = this.state
        return (
            <form onSubmit={this.handleSubmit}>
                <Segment>
                    <h3>Workorder Details</h3>
                    <div className='form-group'>
                        <label htmlFor='title'>Job Title</label>
                        <input
                            placeholder='Enter job title...'
                            className='form-control'
                            onChange={this.handleChange}
                            value={title}
                            name='title'
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>Description</label>
                        <textarea
                            placeholder='Enter job description...'
                            className='form-control'
                            onChange={this.handleChange}
                            value={description}
                            type='textarea'
                            name='description'
                            rows='3'
                        ></textarea>
                    </div>
                </Segment>
                {this.state.mode === 'edit'
                    ? <button
                        style={{ marginTop: '10px' }}
                        className='btn btn-primary'
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Update
                </button>
                    : <button
                        style={{ marginTop: '10px' }}
                        className='btn btn-primary'
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Create
                    </button>}
            </form>
        );
    }
}