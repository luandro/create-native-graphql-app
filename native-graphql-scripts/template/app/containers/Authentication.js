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

const binomialQuery = gql`
	query {
		allPlants(orderBy: createdAt_DESC) {
			binomial
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

export const Login = graphql(binomialQuery, offlineOptions)(LoginContainer);

export const Signup = graphql(binomialQuery, offlineOptions)(SignupContainer);
