/** @format */

import React from 'react';
import {AppRegistry} from 'react-native';
//provider component will be connected to our store and will then wrap our App.js component so to wrap our Provider component- that is a very thun wrapper that we mount as our root component
import { Provider } from 'react-redux';
import App from './App';
//importing store
import configureStore from './src/store/configureStore';
import {name as appName} from './app.json';

const store = configureStore();

//our jsx code where we wrap our app component with provider, and connecting provider with our store
const RNRedux = () => (
    <Provider store={store}>
        <App />
    </Provider>
);


//we connect our RNRedux configuration
AppRegistry.registerComponent(appName, () => RNRedux);
