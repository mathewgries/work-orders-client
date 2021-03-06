import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from "aws-amplify";
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router } from 'react-router-dom'
import config from "./config";
import './index.css';
import App from './containers/static/App';

Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    Storage: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET,
      identityPoolId: config.cognito.IDENTITY_POOL_ID
    },
    API: {
      endpoints: [
        {
          name: 'workorders',
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: 'clients',
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: 'contacts',
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: 'workordersItems',
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: 'address',
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: 'phonenumbers',
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
      ]
    }
  });

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);