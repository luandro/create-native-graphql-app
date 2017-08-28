import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class SignupPage extends Component {
	render() {
		const { navigation: { navigate } } = this.props;
		return (
			<View>
				<Text>Signup</Text>
			</View>
		);
	}
}