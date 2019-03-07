import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AppliedRoute from './components/AppliedRoute'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnAuthenticatedRoute from './components/UnAuthenticatedRoute'
import Home from './containers/static/Home'
import Login from './containers/auth/Login'
import Signup from './containers/auth/Signup'
import NewWorkorder from './containers/workorders/NewWorkorder'
import WorkordersView from './containers/workorders/WorkordersView'
import WorkordersEdit from './containers/workorders/WorkordersEdit'
import ClientList from './containers/clients/ClientList'
import NewClient from './containers/clients/NewClient'
import NotFound from './containers/static/NotFound'

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path='/' exact component={Home} props={childProps} />
        <UnAuthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <UnAuthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
        <AuthenticatedRoute path="/workorders/new" exact component={NewWorkorder} props={childProps} />
        <AuthenticatedRoute path="/workorders/:id" exact component={WorkordersView} props={childProps} />
        <AuthenticatedRoute path="/workorders/edit/:id" exact component={WorkordersEdit} props={childProps} />
        <AuthenticatedRoute path='/clients/new' exact component={NewClient} props={childProps} />
        <AuthenticatedRoute path='/clients' exact component={ClientList} props={childProps} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>