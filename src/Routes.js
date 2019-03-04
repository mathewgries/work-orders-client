import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AppliedRoute from './components/AppliedRoute'
import Home from './containers/static/Home'
import Login from './containers/auth/Login'
import Signup from './containers/auth/Signup'
import NewWorkorder from './containers/workorders/NewWorkorder'
import Workorders from './containers/workorders/Workorders'
import NotFound from './containers/static/NotFound'

export default ({ childProps}) => 
    <Switch>
        <AppliedRoute path='/' exact component={Home} props={childProps}/>
        <AppliedRoute path="/login" exact component={Login} props={childProps}/>
        <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
        <AppliedRoute path="/workorders/new" exact component={NewWorkorder} props={childProps} />
        <AppliedRoute path="/workorders/:id" exact component={Workorders} props={childProps} />
        { /* Finally, catch all unmatched routes */ }
        <Route component={NotFound}/>
    </Switch>