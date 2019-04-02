import React, { Component } from 'react';
import { Auth } from 'aws-amplify'
import { Link } from 'react-router-dom'
import Routes from '../../Routes'
import './App.css'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isAuthenticated: false,
			isAuthenticating: true,
		}
	}

	async componentDidMount() {
		try {
			await Auth.currentSession();
			this.userHasAuthenticated(true);
		}
		catch (e) {
			if (e !== 'No current user') {
				alert(e);
			}
		}

		this.setState({ isAuthenticating: false });
	}

	userHasAuthenticated = authenticated => {
		this.setState({ isAuthenticated: authenticated });
	}

	handleLogout = async event => {
		await Auth.signOut();

		this.userHasAuthenticated(false);
	}

	render() {

		const childProps = {
			isAuthenticated: this.state.isAuthenticated,
			userHasAuthenticated: this.userHasAuthenticated
		};

		return (
			!this.state.isAuthenticating &&
			<div>
				<nav className='navbar navbar-expand-md navbar-dark bg-warning'>
					<div className='container-fluid'>
						<Link className='navbar-brand' to="/">Work Orders</Link>
						<button
							className="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent"
							aria-expanded="true"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className='collapse navbar-collapse' id="navbarSupportedContent">
							<ul className="nav navbar-nav mr-auto">
								<li className='nav-item active'>
									<Link className='nav-link' to='/clients'>Clients</Link>
								</li>
								<li className='nav-item'>
									<Link className='nav-link' to='/contacts'>Contacts</Link>
								</li>

								<li className='nav-item'>
									{this.state.isAuthenticated
										? <button className='btn btn-info' onClick={this.handleLogout}>Logout</button>
										: <ul className="navbar-nav mr-auto">
											<li className='nav-item'>
												<Link className='nav-link' to="/signup">Signup</Link>
											</li>
											<li className='nav-item'>
												<Link className='nav-link' to="/login">Login</Link>
											</li>
										</ul>
									}
								</li>
							</ul>
						</div>
					</div>
				</nav>
				<div className='app container'>
					<Routes childProps={childProps} />
				</div>
			</div >
		);
	}
}

export default App;