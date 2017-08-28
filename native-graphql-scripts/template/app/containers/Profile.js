import React from 'react';
import { View, Text, Button } from 'react-native';

export default class Profile extends React.Component {
	render() {
    const { navigation: { navigate } } = this.props;
		return (
			<View>
				<Text>Profile!</Text>
				<Button title="Menu" onPress={() => navigate('DrawerOpen')} />
			</View>
		);
	}
}
