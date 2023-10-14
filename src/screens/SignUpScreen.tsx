import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {colors} from 'theme';
import BackButton from 'components/BackButton';
import Snackbar from 'react-native-snackbar';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from 'config/firebase';
import {FirebaseError} from 'firebase/app';
import {useAppDispatch, useAppSelector} from 'redux/hooks';
import {setUserLoading} from 'redux/slices/user';
import Loading from 'components/Loading';

const SignUpScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {userLoading} = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();

  const submit = () => {
    if (email && password) {
      dispatch(setUserLoading(true));
      createUserWithEmailAndPassword(auth, email, password)
        .catch((e: FirebaseError) =>
          Snackbar.show({
            text: e.message,
            backgroundColor: 'orange',
          }),
        )
        .finally(() => dispatch(setUserLoading(false)));
    } else {
      Snackbar.show({
        text: 'Email and Password are required!',
        backgroundColor: 'red',
      });
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex justify-between h-full mx-4 mt-5">
        <View className="relative">
          <View className="absolute top-0 left-0 z-10">
            <BackButton />
          </View>
          <Text className={`${colors.heading} text-xl font-bold text-center`}>
            Sign Up
          </Text>
        </View>

        <View className="flex-row justify-center my-3 mt-5">
          <Image
            className="h-72 w-72"
            source={require('assets/images/signup.png')}
          />
        </View>
        <View className="space-y-2 mx-2">
          <Text className={`${colors.heading} text-lg font-bold`}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            className={`${colors.heading} p-4 bg-white rounded-full mb-3`}
          />
          <Text className={`${colors.heading} text-lg font-bold`}>
            Password
          </Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className={`${colors.heading} p-4 bg-white rounded-full mb-3`}
          />
        </View>

        <View>
          {userLoading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              style={{backgroundColor: colors.button}}
              onPress={submit}
              className="my-6 rounded-full p-3 shadow-sm mx-2">
              <Text className="text-center text-white font-bold">Sign Up</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUpScreen;
