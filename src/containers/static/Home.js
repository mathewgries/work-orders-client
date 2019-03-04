import React, { Component } from "react";
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
    console.log('Result: ', result)
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
              <ListGroupItem header={workorder.title.trim().split("\n")[0]}>
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
        <h1>Scratch</h1>
        <p>Manage your projects, clients, and account</p>
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
        {this.props.isAuthenticated ? this.renderWorkorders() : this.renderLander()}
      </div>
    );
  }
}