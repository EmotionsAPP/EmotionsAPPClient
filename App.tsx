import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NotificationSnackbar } from './components';
import { LandingContainer } from './containers/LandingContainer';
import { LandingNavigation } from './navigation';
import { ApplicationState } from './store';
import { dismissNotificationSnackbar } from './store/actions/inAppActions';
import { configureStore } from './store/configureStore';
import {Text} from 'react-native';


export default function App() {  
  return (
    <Provider store={configureStore()}> 
     <Text style={{ marginTop:45}}>
    

      </Text>
    <LandingContainer/> 
    </Provider>
  );
}
