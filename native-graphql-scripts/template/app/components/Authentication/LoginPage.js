import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class LoginPage extends Component {
	render() {
		const { navigation: { navigate }, data } = this.props;
		return (
			<View>
				<Text>Sign In</Text>
				{data && data.toString()}
				<Button title="Login" onPress={() => navigate('Main')} />
			</View>
		);
	}
}