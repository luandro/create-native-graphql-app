import React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import Feed from '../containers/Feed';
import Profile from '../containers/Profile';
import PostPage from '../containers/PostPage';


const MainDrawer = DrawerNavigator({
	Feed: { screen: Feed },
	Profile: { screen: Profile },
});

export default Main = StackNavigator(
	{
		MainDrawer: { screen: MainDrawer },
		PostPage: { screen: PostPage },
	},
	// {
	// 	navigationOptions: {
	// 		header: null,
	// 	}
	// }
);