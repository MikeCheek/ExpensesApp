import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {colors} from 'theme';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'navigation/AppNavigation';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {GoogleAuthProvider, signInWithCredential} from 'firebase/auth';
import {auth} from 'config/firebase';
import Snackbar from 'react-native-snackbar';
import {WEB_CLIENT_ID} from '@env';

GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId: WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
  // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction
  // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const WelcomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredentials = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredentials);
    } catch (error: any) {
      Snackbar.show({
        text: error.message,
        backgroundColor: 'red',
      });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <ScreenWrapper>
      <View className="h-full flex justify-around">
        <View className="flex-row justify-center mt-10">
          <Image
            source={require('assets/images/welcome.gif')}
            className="h-96 w-96"
            style={{shadowColor: 'rgba(0, 0, 0, 0.1)'}}
          />
        </View>

        <View className="mx-5 mb-20">
          <Text
            className={`${colors.heading} text-center font-bold text-4xl mb-10`}>
            Expense Tracker
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
            className="shadow p-3 rounded-full mb-5"
            style={{backgroundColor: colors.button}}>
            <Text className="text-center text-white text-lg font-bold">
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            className="shadow p-3 rounded-full mb-5"
            style={{backgroundColor: colors.button}}>
            <Text className="text-center text-white text-lg font-bold">
              Sign Up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => signIn()}
            className="bg-white shadow p-3 rounded-full">
            <View className="flex-row justify-center items-center space-x-3">
              <Image
                source={require('assets/images/googleIcon.png')}
                className="w-8 h-8"
              />
              <Text
                className={`${colors.heading} text-center text-lg font-bold`}>
                Sign In with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default WelcomeScreen;
