import React, { Component } from "react";
import { Link } from "react-router-dom";
import { List, Header, Segment } from 'semantic-ui-react'
import { LinkContainer } from 'react-router-bootstrap'
import { API } from 'aws-amplify'
import "./Home.css";

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			workorders: []
		};
	}

	async componentDidMount() {
		if (!this.props.isAuthenticated) {
			return;
		}

		try {
			const workorders = await this.loadWorkorders();
			this.setState({ workorders });
		} catch (e) {
			alert(e);
		}

		this.setState({ isLoading: false });
	}

	loadWorkorders() {
		return API.get('workorders', '/workorders')
	}

	renderWorkordersList(workorders) {
		return [{}].concat(workorders).map(
			(workorder, i) =>
				i !== 0
					? <Segment key={workorder.workorderId}>
						<LinkContainer to={`/workorders/${workorder.workorderId}`}>
							<List.Item>
								<List.Header>{`Title: ${workorder.title}`}</List.Header>
								{`Client: ${workorder.client.name}`} <br />
								{`Contact: ${workorder.contact.name}`} <br />
								{"Created: " + new Date(workorder.createdAt).toLocaleString()}
							</List.Item>
						</LinkContainer>
					</Segment>
					: <LinkContainer key="new" to="/workorders/new">
						<List.Item><h4><b>{"\uFF0B"}</b> Create a new workorder</h4></List.Item>
					</LinkContainer>
		);
	}

	renderLander() {
		return (
			<div className="lander">
				<h1>Work Orders</h1>
				<p>Manage your projects, clients, and account</p>
				<div>
					<Link to="/login" className="btn btn-info btn-lg">
						Login
        			</Link>
					<Link to="/signup" className="btn btn-success btn-lg">
						Signup
        			</Link>
				</div>
			</div>
		);
	}

	renderWorkorders() {
		return (
			<div className="workorders">
				<Header as='h1'>Your Workorders</Header>
				<hr />
				<List>
					{!this.state.isLoading && this.renderWorkordersList(this.state.workorders)}
				</List>
			</div>
		);
	}

	render() {
		return (
			<div className="Home">
				{this.props.isAuthenticated
					? this.renderWorkorders()
					: this.renderLander()
				}
			</div>
		);
	}
}