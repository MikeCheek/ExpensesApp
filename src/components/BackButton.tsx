import {TouchableOpacity} from 'react-native';
import React from 'react';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {colors} from 'theme';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'navigation/AppNavigation';

const BackButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      className="bg-white rounded-full h-8 w-8">
      <ChevronLeftIcon size="30" color={colors.button} />
    </TouchableOpacity>
  );
};

export default BackButton;
