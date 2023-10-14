import React, {useEffect, useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {colors} from 'theme';
import {Trip} from 'constants/items';
import randomImage from 'utility/randomImage';
import EmptyList from 'components/EmptyList';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'navigation/AppNavigation';
import {signOut} from 'firebase/auth';
import {auth, db, tripsRef} from 'config/firebase';
import {useAppSelector} from 'redux/hooks';
import {deleteDoc, doc, getDocs, query, where} from 'firebase/firestore';
import {Swipeable} from 'react-native-gesture-handler';
import RightSwipeActions from 'components/RightSwipeActions';
import Snackbar from 'react-native-snackbar';

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {user} = useAppSelector(state => state.user);

  const [trips, setTrips] = useState<Trip[]>([]);

  const isFocused = useIsFocused();

  const deleteTrip = (name: string, id: string) => {
    deleteDoc(doc(db, 'trips', id)).then(() => {
      Snackbar.show({
        text: name + ' trip deleted',
        backgroundColor: 'green',
      });
      fetchTrips();
    });
  };

  const fetchTrips = async () => {
    const q = query(tripsRef, where('userId', '==', user!.uid));
    const querySnapshot = await getDocs(q);
    setTrips(
      querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id} as Trip)),
    );
  };

  useEffect(() => {
    if (isFocused) fetchTrips();
  }, [isFocused]);

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <ScreenWrapper className="flex">
      <View className="flex-row justify-between items-center p-4 mt-5">
        <Text className={`${colors.heading} font-bold text-3xl shadow-sm`}>
          Expense Tracker
        </Text>
        <TouchableOpacity
          onPress={logOut}
          className="py-2 px-3 bg-white border border-gray-200 rounded-full">
          <Text className={colors.heading}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center items-center bg-blue-200 rounded-xl mx-4 mb-4">
        <Image
          source={require('assets/images/banner.png')}
          className="w-60 h-60"
        />
      </View>
      <View className="px-4 space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className={`${colors.heading} font-bold text-xl`}>
            Recent Trips
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTrip')}
            className="py-2 px-3 bg-white border border-gray-200 rounded-full">
            <Text className={colors.heading}>Add Trip</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 340}}>
          <FlatList
            data={trips}
            ListEmptyComponent={
              <EmptyList message="You haven't recorded any trips yet" />
            }
            numColumns={2}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            className="mx-1"
            renderItem={({item}) => (
              <Swipeable
                renderRightActions={(progress, dragX) =>
                  RightSwipeActions({
                    onPress: () => deleteTrip(item.place, item.id),
                    dragX,
                    progress,
                  })
                }
                // onSwipeableOpen={direction => console.log(direction)}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('TripExpenses', {...item})}
                  className="bg-white p-3 rounded-2xl mb-3 shadow-sm">
                  <View>
                    <Image source={randomImage()} className="w-32 h-32 mb-2" />
                    <Text className={`${colors.heading} font-bold`}>
                      {item.place}
                    </Text>
                    <Text className={`${colors.heading} text-xs`}>
                      {item.country}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            )}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;
