import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Login, Signup } from '../containers/Authentication';


export default AuthenticationTabs = TabNavigator(
	{
	Login: { screen: Login },
	Signup: { screen: Signup },
	},
	{
		tabBarOptions: {
			style: {
				paddingTop: 30,
				paddingBottom: 15,
			}
		}
	}
);