import React from 'react';
import { graphql, gql } from 'react-apollo';
import LoginPage from '../components/Authentication/LoginPage';
import SignupPage from '../components/Authentication/SignupPage';

class LoginContainer extends React.Component {
	render() {
		return <LoginPage {...this.props} />;
	}
}

class SignupContainer extends React.Component {
	render() {
		return <LoginPage {...this.props} />;
	}
}

const userQuery = gql`
	query {
		user(id: 9) {
			name
			email
		}
	}
`;

const offlineOptions = {
	options: {
		fetchPolicy: 'network-only',
		variables: {
			__offline__: true
		}
	}
};

export const Login = graphql(userQuery, offlineOptions)(LoginContainer);

export const Signup = graphql(userQuery, offlineOptions)(SignupContainer);
