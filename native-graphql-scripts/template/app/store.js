import { AsyncStorage } from 'react-native';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import defaultConfig from 'redux-offline/lib/defaults';
import offline from 'apollo-offline';


let composeEnhancers = composeWithDevTools({
    realtime: true,
    name: 'Cultivar',
});

// 1. Wrap your network interface
const { enhancer, networkInterface } = offline(
  createNetworkInterface({
    uri: `https://api.graph.cool/simple/v1/cj6pnt5kr0uh80181o4bl7dkj`,
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
  persistCallback: () => { console.log('CALLLLLLBACK!') },
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