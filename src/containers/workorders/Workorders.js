import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import LoaderButton from '../../components/LoaderButton'
import config from '../../config'
import { s3Upload } from '../../libs/awsLib';
import './Workorders.css'
import { API, Storage } from "aws-amplify";

export default class Workorders extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            isLoading: null,
            isDeleting: null,
            workorder: null,
            title: '',
            client: '',
            contact: '',
            description: '',
            attachmentURL: null
        };
    }

    async componentDidMount() {
        try {
            let attachmentURL;
            const workorder = await this.getWorkorder();
            const { title, client, contact, description, attachment } = workorder;

            if (attachment) {
                attachmentURL = await Storage.vault.get(attachment);
            }

            this.setState({ workorder, title, client, contact, description, attachmentURL });
        } catch (e) {
            alert(e);
        }
    }

    getWorkorder() {
        return API.get("workorders", `/workorders/${this.props.match.params.id}`);
    }

    validateForm() {
        const { title, client, contact, description } = this.state
        return title.length > 0 || client.length > 0 || contact.length > 0 || description.length > 0
    }

    formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    saveWorkorder(workorder) {
        return API.put("workorders", `/workorders/${this.props.match.params.id}`, {
            body: workorder
        });
    }

    handleSubmit = async event => {
        let attachment;

        event.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }

        this.setState({ isLoading: true });

        try {
            if (this.file) {
                attachment = await s3Upload(this.file);
            }

            const { title, client, contact, description } = this.state
            await this.saveWorkorder({
                title,
                client,
                contact,
                description,
                attachment: attachment || this.state.workorder.attachment
            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }


    deleteWorkorder() {
        return API.del("workorders", `/workorders/${this.props.match.params.id}`);
    }

    handleDelete = async event => {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this workorder?"
        );

        if (!confirmed) {
            return;
        }

        this.setState({ isDeleting: true });

        try {
            await this.deleteWorkorder();
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isDeleting: false });
        }
    }


    render() {
        const { title, client, contact, description } = this.state
        return (
            <div className='Workorders'>
                {this.state.workorder &&
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId='title'>
                            <FormControl
                                onChange={this.handleChange}
                                value={title}
                                componentClass='input'
                            />
                        </FormGroup>
                        <FormGroup controlId='client'>
                            <FormControl
                                onChange={this.handleChange}
                                value={client}
                                componentClass='input'
                            />
                        </FormGroup>
                        <FormGroup controlId='contact'>
                            <FormControl
                                onChange={this.handleChange}
                                value={contact}
                                componentClass='input'
                            />
                        </FormGroup>
                        <FormGroup controlId='description'>
                            <FormControl
                                onChange={this.handleChange}
                                value={description}
                                componentClass='textarea'
                            />
                        </FormGroup>
                        {this.state.workorder.attachment &&
                            <FormGroup>
                                <ControlLabel>Attachment</ControlLabel>
                                <FormControl.Static>
                                    <a
                                        target='_blank'
                                        rel="noopener noreferrer"
                                        href={this.state.attachmentURL}
                                    >
                                        {this.formatFilename(this.state.workorder.attachment)}
                                    </a>
                                </FormControl.Static>
                            </FormGroup>}
                        <FormGroup controlId="file">
                            {!this.state.workorder.attachment &&
                                <ControlLabel>Attachment</ControlLabel>}
                            <FormControl onChange={this.handleFileChange} type="file" />
                        </FormGroup>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Save"
                            loadingText="Saving…"
                        />
                        <LoaderButton
                            block
                            bsStyle="danger"
                            bsSize="large"
                            isLoading={this.state.isDeleting}
                            onClick={this.handleDelete}
                            text="Delete"
                            loadingText="Deleting…"
                        />
                    </form>}
            </div>
        )
    }
}