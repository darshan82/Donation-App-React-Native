import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './src/navigation/authStack';
import store from './src/redux/reducer';
import {useDispatch, useSelector} from 'react-redux';
import DonorStack from './src/navigation/donarStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addUser} from './src/redux/action';
import AcceptorStack from './src/navigation/acceptorStack';
import Toast from 'react-native-toast-message';
import AppLoader from './src/components/loader';

const App = () => {
  const [back, setBack] = useState(false);
  const dispatch = useDispatch();
  const checkLocalStorage = async () => {
    // await AsyncStorage.multiRemove(['token', 'userType']);
    const keys = await AsyncStorage.multiGet(['token', 'userType']);
    if (keys[0][1]) {
      dispatch(addUser({token: keys[0][1], userType: keys[1][1]}));
    }
    setBack(true);
  };
  useEffect( () => {

    checkLocalStorage();
  }, []);
  const {token, userType} = useSelector(state => state.user);
  

  return (
    back && (
      <>
      <NavigationContainer>
        {!token ? (
          <AuthStack />
        ) : userType === 'Donor' ? (
          <DonorStack />
        ) : (
          <AcceptorStack />
        )}
        {/* <AuthStack/> */}
      </NavigationContainer>
      <Toast
       position='bottom'
       bottomOffset={20}
      />
      <AppLoader/>
      </>

    )
  );
};
export default App;
