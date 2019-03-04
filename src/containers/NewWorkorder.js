import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { API } from 'aws-amplify'
import { s3Upload } from '../libs/awsLib'
import config from "../config";
import "./NewWorkorder.css";

export default class NewWorkorder extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            // Add the fields to the state
            // Job Title, Job Description, 
            isLoading: null,
            title: '',
            client: '',
            contact: '',
            description: ""
        };
    }

    validateForm() {
        const {title, client, contact,description} = this.state
        
        return title.length > 0
        || client.length > 0
        || contact.length > 0
        || description.length > 0
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    handleSubmit = async event => {
        event.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }

        this.setState({ isLoading: true });

        try {
            const { title, client, contact, description } = this.state
            const attachment = this.file
                ? await s3Upload(this.file)
                : null;

            await this.createWorkorder({
                attachment,
                content: {
                    title,
                    client,
                    contact,
                    description
                }
            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    createWorkorder(workorder) {
        return API.post('workorders', '/workorders', {
            body: workorder
        });
    }

    render() {

        const { title, client, contact, description } = this.state

        return (
            <div className="NewWorkorder">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId='title'>
                        <ControlLabel>Job Title</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={title}
                            componentClass='input'
                        />
                    </FormGroup>
                    <FormGroup controlId='client'>
                        <ControlLabel>Client Name</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={client}
                            componentClass='input'
                        />
                    </FormGroup>
                    <FormGroup controlId='contact'>
                        <ControlLabel>Client Name</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={contact}
                            componentClass='input'
                        />
                    </FormGroup>
                    <FormGroup controlId="content">
                        <FormControl
                            onChange={this.handleChange}
                            value={description}
                            componentClass="textarea"
                        />
                    </FormGroup>
                    <FormGroup controlId="file">
                        <ControlLabel>Attachment</ControlLabel>
                        <FormControl onChange={this.handleFileChange} type="file" />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Create"
                        loadingText="Creating…"
                    />
                </form>
            </div>
        );
    }
}