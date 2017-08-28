import React from 'react';
import { View, Text, Button } from 'react-native';

export default class PostPage extends React.Component {
	render() {
    const { navigation: { navigate } } = this.props;
		return (
			<View>
				<Text>PostPage!</Text>
			</View>
		);
	}
}
