import React, { Component } from "react";
import LoadingStatus from '../../components/LoadingStatus'
import { getWorkorders } from '../../api/workorders'
import { getClients } from '../../api/clients'
import { getContacts } from '../../api/contacts'
import { Link } from "react-router-dom";
import "./Home.css";

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			clients: [],
			contacts: [],
			workorders: []
		};
	}

	async componentDidMount() {
		if (!this.props.isAuthenticated) {
			return;
		}

		try {
			const workorders = await getWorkorders()
			const clients = await getClients()
			const contacts = await getContacts()
			this.setState({ workorders, clients, contacts });
		} catch (e) {
			alert(e);
		}

		this.setState({ isLoading: false });
	}

	matchClient(clientId) {
		const result = this.state.clients.filter((client) =>
			client.clientId === clientId)
		return result[0]
	}


	matchContact(contactId) {
		const result = this.state.contacts.filter((contact) =>
			contact.contactId === contactId)
		return result[0]
	}

	renderWorkordersList(workorders) {
		return workorders.map((workorder, i) => {
			let client = this.matchClient(workorder.clientId)
			let contact = this.matchContact(workorder.contactId)
			return (
				<div key={workorder.workorderId} className='main-list-item'>
					<Link to={`/workorders/${workorder.workorderId}`}>
						<div>
							<h5>{`Title: ${workorder.title}`}</h5>
							<div className='card-list-item'>{`Client: ${client.name}`}</div> <br />
							<div className='card-list-item'>{`Contact: ${contact.name}`}</div> <br />
							<div className='card-list-item'>{"Created: " + new Date(workorder.createdAt).toLocaleString()}</div>
						</div>
					</Link>
				</div>
			)
		});
	}

	renderLander() {
		return (
			<div className="lander">
				<h1>Work Orders</h1>
				<p>Manage your projects, clients, and account</p>
				<div>
					<Link to="/login" className="btn btn-warning btn-lg">
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
			<div className="workorders container">
				<h1>Your Workorders</h1>
				<hr />
				<div key="new" to="/workorders/new">
					<Link to="/workorders/new"><h4><b>{"\uFF0B"}</b> Create a new workorder</h4></Link>
				</div>
				<div className='main-list'>
					{!this.state.isLoading && this.renderWorkordersList(this.state.workorders)}
				</div>
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