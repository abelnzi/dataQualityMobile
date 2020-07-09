import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContainer from './screems/AppContainer'
import {Provider} from 'react-redux'
import Store from './store/configureStore'

export default function App() {
  return (
    <Provider store={Store}>
      <AppContainer />
    </Provider>
  );
}
