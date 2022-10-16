import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NotificationSnackbar } from './components';
import { LandingContainer } from './containers/LandingContainer';
import { LandingNavigation } from './navigation';
import { ApplicationState } from './store';
import { dismissNotificationSnackbar } from './store/actions/inAppActions';
import { configureStore } from './store/configureStore';

export default function App() {  
  return (
    <Provider store={configureStore()}>
      <LandingContainer/>
    </Provider>
  );
}
