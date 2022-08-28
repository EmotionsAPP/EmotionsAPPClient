import React from 'react';
import { Provider } from 'react-redux';
import { LandingNavigation } from './navigation';
import { configureStore } from './store/configureStore';

export default function App() {
  return (
    <Provider store={configureStore()}>
      <LandingNavigation/>
    </Provider>
  );
}
