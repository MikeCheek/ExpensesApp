import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {colors} from 'theme';
import BackButton from 'components/BackButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'navigation/AppNavigation';
import Loading from 'components/Loading';
import Snackbar from 'react-native-snackbar';
import {addDoc} from 'firebase/firestore';
import {tripsRef} from 'config/firebase';
import {useAppSelector} from 'redux/hooks';
import {FirebaseError} from 'firebase/app';

const AddTripScreen = () => {
  const [place, setPlace] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const {user} = useAppSelector(state => state.user);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const addTrip = async () => {
    if (place && country) {
      setLoading(true);
      let doc;
      try {
        doc = await addDoc(tripsRef, {
          place,
          country,
          userId: user!.uid,
        });
      } catch (e) {
        Snackbar.show({
          text: (e as FirebaseError).message,
          backgroundColor: 'red',
        });
      }
      setLoading(false);
      if (doc && doc.id) navigation.goBack();
    } else {
      Snackbar.show({
        text: 'Place and Country are required!',
        backgroundColor: 'red',
      });
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex justify-between h-full mx-4">
        <View className="relative mt-5">
          <View className="absolute top-0 left-0 z-10">
            <BackButton />
          </View>
          <Text className={`${colors.heading} text-xl font-bold text-center`}>
            Add Trip
          </Text>
        </View>

        <View className="flex-row justify-center my-3 mt-5">
          <Image
            className="h-72 w-72"
            source={require('assets/images/4.png')}
          />
        </View>
        <View className="space-y-2 mx-2">
          <Text className={`${colors.heading} text-lg font-bold`}>
            Where On Earth?
          </Text>
          <TextInput
            value={place}
            onChangeText={setPlace}
            className={`${colors.heading} p-4 bg-white rounded-full mb-3`}
          />
          <Text className={`${colors.heading} text-lg font-bold`}>
            Which Country?
          </Text>
          <TextInput
            value={country}
            onChangeText={setCountry}
            className={`${colors.heading} p-4 bg-white rounded-full mb-3`}
          />
        </View>

        <View>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              style={{backgroundColor: colors.button}}
              onPress={addTrip}
              className="my-6 rounded-full p-3 shadow-sm mx-2">
              <Text className="text-center text-white font-bold">Add Trip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddTripScreen;
