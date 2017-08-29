import { AsyncStorage } from 'react-native';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import defaultConfig from 'redux-offline/lib/defaults';
import offline from 'apollo-offline';


let composeEnhancers = composeWithDevTools({
    realtime: true,
    name: 'graphql-app',
});

// 1. Wrap your network interface
const { enhancer, networkInterface } = offline(
  createNetworkInterface({
    uri: `192.168.100.101:9002/graphql`,
  }),
);

// 2. Create your Apollo client
export const client = new ApolloClient({
  /* Your Apollo configuration here... */
  networkInterface,
});

const customConfig = {
  ...defaultConfig,
  persistOptions: {
    storage: AsyncStorage,
  },
  persistCallback: () => { console.log('persisting!') }, //remove this once done testing
}


// 3. Pass the client to the offline network interface
// (Optional, but needed for the optimistic fetch feature)
networkInterface.setClient(client);

// 4. Create your redux store
export const store = createStore(
  combineReducers({
    apollo: client.reducer(),
  }),
  undefined,
  composeEnhancers(
    applyMiddleware(client.middleware()),
    enhancer(customConfig),
  ),
);