import React from 'react';
import { StackNavigator } from 'react-navigation';
import AuthenticationTabs from './AuthenticationTabs';
import Main from './Main';

export default RouterNavigator = StackNavigator(
	{
		Authentication: { screen: AuthenticationTabs },
		Main : { screen: Main },
	},
	{
		navigationOptions: {
			header: null,
		}
	}
);
