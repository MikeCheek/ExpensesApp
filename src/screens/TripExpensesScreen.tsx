import React, {useEffect, useState} from 'react';
import ScreenWrapper from 'components/ScreenWrapper';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {colors} from 'theme';
import EmptyList from 'components/EmptyList';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  RootStackParamList,
  TripExpensesScreenProps,
} from 'navigation/AppNavigation';
import BackButton from 'components/BackButton';
import ExpenseCard from 'components/ExpenseCard';
import {Expense} from 'constants/expenses';
import {expensesRef} from 'config/firebase';
import {getDocs, query, where} from 'firebase/firestore';
import {categoryBG} from 'theme';
import {PieChart} from 'react-native-gifted-charts';

type Data = {
  value: number;
  color: string;
  gradientCenterColor: string;
  focused?: boolean;
}[];

const TripExpensesScreen = ({route}: TripExpensesScreenProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {id, country, place} = route.params;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [data, setData] = useState<Data>([]);

  const isFocused = useIsFocused();

  const maxData = data.sort((a, b) => b.value - a.value)[0];
  const total = expenses
    .map(e => e.amount)
    .reduce((acc, value) => acc * 1 + value * 1, 0);

  const typesInData = data.filter(d => d.value != 0);

  const fetchExpenses = async () => {
    const q = query(expensesRef, where('tripId', '==', id));
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs
      .map(doc => ({...doc.data(), id: doc.id} as Expense))
      .sort((a, b) => b.datetime - a.datetime);
    setExpenses(docs);
  };

  const calculateData = () => {
    const d = Object.entries(categoryBG).map(([name, color]) => ({
      value: 0,
      color: color,
      gradientCenterColor: color,
      title: name,
    }));
    expenses.forEach(exp =>
      d.forEach(b => {
        b.title.toLowerCase() === exp.category.toLowerCase()
          ? (b.value = b.value * 1 + exp.amount * 1)
          : null;
      }),
    );
    const max = d.sort((a, b) => b.value - a.value)[0];
    const final = d.map(b =>
      b.title.toLowerCase() === max.title.toLowerCase()
        ? {...b, focused: true}
        : b,
    );
    setData(final);
  };

  useEffect(() => {
    if (isFocused) fetchExpenses();
  }, [isFocused]);

  useEffect(() => {
    calculateData();
  }, [expenses]);

  return (
    <ScreenWrapper className="flex">
      <View className="px-4">
        <View className="relative mt-10">
          <View className="absolute top-2 left-0 z-10">
            <BackButton />
          </View>
          <View>
            <Text className={`${colors.heading} text-xl font-bold text-center`}>
              {place}
            </Text>
            <Text className={`${colors.heading} text-xs text-center`}>
              {country}
            </Text>
          </View>
        </View>

        <View className="flex-col justify-center items-center mt-8 mb-4">
          <View>
            <PieChart
              data={data}
              donut
              showGradient
              sectionAutoFocus
              focusOnPress
              radius={90}
              innerRadius={60}
              innerCircleColor={
                typesInData.length === 1 ? typesInData[0].color : '#f2f2f2'
              }
              centerLabelComponent={() => {
                return (
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    {maxData && maxData.value && total ? (
                      <>
                        <Text
                          className={`${colors.heading} font-bold text-2xl`}>
                          {((maxData.value / total) * 100).toFixed(1)}%
                        </Text>

                        <Text
                          className={`${colors.heading} capitalize text-base`}>
                          {
                            Object.entries(categoryBG).find(
                              o => o[1] === maxData.color,
                            )?.[0]
                          }
                        </Text>
                      </>
                    ) : (
                      <></>
                    )}
                  </View>
                );
              }}
            />
          </View>
          <View className="flex-row flex-wrap gap-2 items-center justify-center">
            {Object.entries(categoryBG).map(([name, color], key) => (
              <View key={key} className="flex-row items-center justify-between">
                <View
                  className="h-4 w-4 rounded-full mr-1 border-gray-300 border-[0.5px]"
                  style={{backgroundColor: color}}
                />
                <Text className={`${colors.heading} capitalize`}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className={`${colors.heading} font-bold text-xl`}>
              Expenses: {total} €
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddExpense', {id, place, country})
              }
              className="py-2 px-3 bg-white border border-gray-200 rounded-full">
              <Text className={colors.heading}>Add Expense</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 320}}>
            <FlatList
              scrollEventThrottle={1}
              data={expenses}
              ListEmptyComponent={
                <EmptyList message="You haven't recorded any expenses yet" />
              }
              keyExtractor={item => `${item.id}`}
              showsVerticalScrollIndicator={false}
              className="mx-1"
              renderItem={({item}) => (
                <ExpenseCard item={item} onDelete={fetchExpenses} />
              )}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default TripExpensesScreen;
