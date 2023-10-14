import AppNavigation from 'navigation/AppNavigation';
import React, {useEffect} from 'react';
import {AvoidSoftInput} from 'react-native-avoid-softinput';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store} from 'redux/store';
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';

const App = () => {
  useEffect(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    const unsubscribe = NetInfo.addEventListener(state => {
      state.isConnected
        ? null
        : Snackbar.show({
            text: `${state.isConnected ? 'Connected' : 'Disconnected'}
You are ${state.isConnected ? 'online' : 'offline'}`,
            backgroundColor: state.isConnected ? 'green' : 'red',
          });
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
