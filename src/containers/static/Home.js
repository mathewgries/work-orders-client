import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
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
			const workorders = await this.workorders();
			this.setState({ workorders });
		} catch (e) {
			alert(e);
		}

		this.setState({ isLoading: false });
	}

	workorders() {
		const result = API.get('workorders', '/workorders');
		return result
	}

	renderWorkordersList(workorders) {
		return [{}].concat(workorders).map(
			(workorder, i) =>
				i !== 0
					? <LinkContainer
						key={workorder.workorderId}
						to={`/workorders/${workorder.workorderId}`}
					>
						<ListGroupItem header={workorder.title}>
							{"Created: " + new Date(workorder.createdAt).toLocaleString()}
						</ListGroupItem>
					</LinkContainer>
					: <LinkContainer
						key="new"
						to="/workorders/new"
					>
						<ListGroupItem>
							<h4>
								<b>{"\uFF0B"}</b> Create a new workorder
                </h4>
						</ListGroupItem>
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
				<PageHeader>Your Workorders</PageHeader>
				<ListGroup>
					{!this.state.isLoading && this.renderWorkordersList(this.state.workorders)}
				</ListGroup>
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