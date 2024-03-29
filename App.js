/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Routes from './src/Routes';
import {Provider as PaperProvider} from 'react-native-paper';
const App = () => {
  return (
    <PaperProvider>
      <Routes />
    </PaperProvider>
  );
};

export default App;
