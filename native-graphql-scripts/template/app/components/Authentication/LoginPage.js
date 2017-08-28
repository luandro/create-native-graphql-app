import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class LoginPage extends Component {
	render() {
		const { navigation: { navigate } } = this.props;
		return (
			<View>
				<Text>Sign In</Text>
				<Button title="Login" onPress={() => navigate('Main')} />
			</View>
		);
	}
}