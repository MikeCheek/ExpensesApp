import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import HomeScreen from 'screens/HomeScreen';
import AddTripScreen from 'screens/AddTripScreen';
import AddExpenseScreen from 'screens/AddExpenseScreen';
import TripExpensesScreen from 'screens/TripExpensesScreen';
import {Trip} from 'constants/items';
import WelcomeScreen from 'screens/WelcomeScreen';
import SignInScreen from 'screens/SignInScreen';
import SignUpScreen from 'screens/SignUpScreen';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from 'config/firebase';
import {setUser} from 'redux/slices/user';

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  SignIn: undefined;
  SignUp: undefined;
  AddTrip: undefined;
  AddExpense: Omit<Trip, 'userId'>;
  TripExpenses: Trip;
};

export type AddExpenseScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AddExpense'
>;
export type TripExpensesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TripExpenses'
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const {user} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  onAuthStateChanged(auth, u => {
    dispatch(setUser(u));
  });

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddTrip"
            component={AddTripScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            initialParams={{country: '', id: '', place: ''}}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TripExpenses"
            component={TripExpensesScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{headerShown: false, presentation: 'modal'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{headerShown: false, presentation: 'modal'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;
