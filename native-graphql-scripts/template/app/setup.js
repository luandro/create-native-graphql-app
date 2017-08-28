import React from 'react';
import { Text, ActivityIndicator } from 'react-native';
import I18n from 'ex-react-native-i18n';
import { ApolloProvider } from 'react-apollo';
import { connect } from 'react-redux';
import { store, client } from './store';
import Router from './routers'; // Your main application component

// Component to postpone render until after Redux state has been rehydrated
const Rehydrated = connect(({ rehydrated }) => ({ rehydrated }))(
	props => (props.rehydrated ? props.children : props.loading)
);

const Loading = () => <ActivityIndicator style={{ flex: 1 }} />;

class App extends React.Component {
	async componentWillMount() {
		console.log('App await locale');
		try {
			await I18n.initAsync();
		} catch (e) {
			console.log(e);
			return;
		}
		console.log('App locale done');
	}

	render() {
		return (
			<ApolloProvider client={client} store={store}>
				{/* <Rehydrated loading={<Loading />}> */}
                    <Router />
				{/* </Rehydrated> */}
			</ApolloProvider>
		);
	}
}

export default App;
