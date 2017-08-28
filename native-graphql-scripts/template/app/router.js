// Structure:
// https://github.com/kyaroru/ReactNavDrawer/blob/master/src/utils/navigation.js

import React, { Component } from 'react';
import { Button, Icon } from 'native-base';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';
import DrawBar from './containers/DrawBar';
import { Login, Signup } from './containers/Authentication';
import Home from './containers/Home';
import Catalogue from './containers/Catalogue';

const AuthNavigator = TabNavigator({
	Login: { screen: Login },
	Signup: { screen: Signup }
});

const MainNavigator = TabNavigator(
	{
		Home: { screen: Home },
		// Poll: { screen: Poll },
		// Guide: { screen: Guide },
		Catalogue: { screen: Catalogue }
	},
	{
		tabBarPosition: 'bottom'
	}
);

const DrawerRouter = DrawerNavigator(
	{
		Auth: { screen: AuthNavigator },
		Main: { screen: MainNavigator }
		// Profile: { screen: Profile },
		// Configurations: { screen: Configurations },
		// Reader: { screen: Reader },
		// Donations: { screen: Donations },
		// About: { screen: About },
	},
	{
		contentComponent: props => <DrawBar {...props} />
	}
);

const HomeStack = StackNavigator(
	{
		Home: { screen: Home }
		// PlantPage: {
		//   path: 'plant/:cname',
		//   screen: PlantPage
		//  },
		// CreatePostPage: { screen: CreatePostPage },
	},
	{
		navigationOptions: {
			header: null,
		}
	},
);

export default (RouterNavigator = StackNavigator(
	{
		Home: { screen: DrawerRouter }
	},
	{
		navigationOptions: ({ navigation }) => ({
			headerLeft: (
				<Button onPress={() => navigation.navigate('DrawerOpen')}>
					<Icon name="menu" style={{ fontSize: 20, color: 'white' }} />
				</Button>
			),
			headerTitle: 'Cultivar',
			headerTitleStyle: {
				color: '#FFF'
			},
			headerStyle: {
				backgroundColor: 'green'
			},
			headerBackTitle: null,
			headerTintColor: '#FFF'
		})
		// styles
	}
));
