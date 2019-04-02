import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AppliedRoute from './components/AppliedRoute'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import UnAuthenticatedRoute from './components/UnAuthenticatedRoute'
import Home from './containers/static/Home'
import Login from './containers/auth/Login'
import Signup from './containers/auth/Signup'
import WorkorderForm from './containers/workorders/WorkorderForm'
import WorkorderView from './containers/workorders/WorkorderView'
import ClientForm from './containers/clients/ClientForm'
import ClientList from './containers/clients/ClientList'
import ClientView from './containers/clients/ClientView'
import ContactForm from './containers/contacts/ContactForm'
import ContactList from './containers/contacts/ContactList'
import ContactView from './containers/contacts/ContactView'
import NotFound from './containers/static/NotFound'

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path='/' exact component={Home} props={childProps} />
        <UnAuthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <UnAuthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
        <AuthenticatedRoute path="/workorders/new" exact component={WorkorderForm} props={childProps} />
        <AuthenticatedRoute path="/workorders/:id" exact component={WorkorderView} props={childProps} />
        <AuthenticatedRoute path="/workorders/edit/:id" exact component={WorkorderForm} props={childProps} />
        <AuthenticatedRoute path='/clients' exact component={ClientList} props={childProps} />
        <AuthenticatedRoute path='/clients/new' exact component={ClientForm} props={childProps} />
        <AuthenticatedRoute path='/clients/:id' exact component={ClientView} props={childProps} />
        <AuthenticatedRoute path='/clients/edit/:id' exact component={ClientForm} props={childProps} />
        <AuthenticatedRoute path='/contacts/new' exact component={ContactForm} props={childProps} />
        <AuthenticatedRoute path='/contacts' exact component={ContactList} props={childProps} />
        <AuthenticatedRoute path='/contacts/:id' exact component={ContactView} props={childProps} />
        <AuthenticatedRoute path='/contacts/edit/:id' exact component={ContactForm} props={childProps} />
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>