import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {colors} from 'theme';
import BackButton from 'components/BackButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AddExpenseScreenProps,
  RootStackParamList,
} from 'navigation/AppNavigation';
import categories from 'constants/categories';
import Snackbar from 'react-native-snackbar';
import {addDoc, updateDoc} from 'firebase/firestore';
import {expensesRef} from 'config/firebase';
import {FirebaseError} from 'firebase/app';
import Loading from 'components/Loading';

const AddExpenseScreen = ({route}: AddExpenseScreenProps) => {
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const {id} = route.params;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const addExpense = async () => {
    if (title && amount && category) {
      setLoading(true);
      let doc;
      try {
        doc = await addDoc(expensesRef, {
          title,
          category,
          amount,
          datetime: Date.now(),
          tripId: id,
        });
      } catch (e) {
        Snackbar.show({
          text: (e as FirebaseError).message,
          backgroundColor: 'red',
        });
      }
      setLoading(false);
      if (doc && doc.id) {
        updateDoc(doc, {
          id: doc.id,
        });
        navigation.goBack();
      }
    } else {
      Snackbar.show({
        text: 'Please fill all the fields!',
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
            Add Expense
          </Text>
        </View>

        <View className="flex-row justify-center my-3">
          <Image
            className="h-60 w-60"
            source={require('assets/images/expenseBanner.png')}
          />
        </View>
        <ScrollView className="space-y-2 mx-2">
          <Text className={`${colors.heading} text-lg font-bold`}>
            For What?
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            className={`${colors.heading} p-4 bg-white rounded-full mb-3`}
          />
          <Text className={`${colors.heading} text-lg font-bold`}>
            How much?
          </Text>
          <TextInput
            value={amount}
            onChangeText={text => setAmount(text.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            className={`${colors.heading} p-4 bg-white rounded-full mb-3`}
          />
          <View className="mx-2 space-x-2">
            <Text className={`${colors.heading} text-lg font-bold`}>
              Category
            </Text>
            <View className="flex-row flex-wrap items-center">
              {categories.map((cat, key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setCategory(cat.value)}
                  style={{
                    backgroundColor:
                      category === cat.value ? 'rgb(187 247 208)' : '#ffffff',
                  }}
                  className="rounded-full bg-white px-4 py-3 mb-2 mr-2">
                  <Text className={colors.heading}>{cat.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              style={{backgroundColor: colors.button}}
              onPress={addExpense}
              className="my-6 rounded-full p-3 shadow-sm mx-2">
              <Text className="text-center text-white font-bold">
                Add Expense
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddExpenseScreen;
