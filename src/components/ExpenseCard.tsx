import {View, Text} from 'react-native';
import React from 'react';
import {Expense} from 'constants/expenses';
import {categoryBG, colors} from 'theme';
import {Swipeable} from 'react-native-gesture-handler';
import RightSwipeActions from './RightSwipeActions';
import {deleteDoc, doc} from 'firebase/firestore';
import {db} from 'config/firebase';
import Snackbar from 'react-native-snackbar';

interface ExpenseCardProps {
  item: Expense;
  onDelete: () => void;
}

const ExpenseCard = ({item, onDelete}: ExpenseCardProps) => {
  const deleteExpense = () => {
    deleteDoc(doc(db, 'expenses', item.id)).then(() => {
      Snackbar.show({
        text: item.title + ' deleted',
        backgroundColor: 'green',
      });
      onDelete();
    });
  };

  return (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        RightSwipeActions({onPress: deleteExpense, dragX, progress})
      }

      // onSwipeableOpen={direction => console.log(direction)}
    >
      <View
        style={{backgroundColor: categoryBG[item.category]}}
        className="flex-row justify-between items-center py-3 px-5 mb-3 rounded-2xl">
        <View>
          <Text className={`${colors.heading} font-bold`}>{item.title}</Text>
          <Text className={`${colors.heading} text-xs capitalize`}>
            {item.category}
          </Text>
        </View>
        <View>
          <Text className={colors.heading}>{item.amount} €</Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default ExpenseCard;
