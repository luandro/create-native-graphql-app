import React from 'react';
import { View, Text, Button } from 'react-native';

export default class Feed extends React.Component {
	static navigationOptions = {
		drawerLabel: 'Lola',
	}
	render() {
		const { navigation: { navigate } } = this.props;
		return (
			<View>
				<Text>Feed!</Text>
				<Button title="Logout" onPress={() => navigate('Authentication')} />
				<Button title="Post" onPress={() => navigate('PostPage')} />
				<Button title="Menu" onPress={() => navigate('DrawerOpen')} />
			</View>
		);
	}
}
