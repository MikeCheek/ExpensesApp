import {View, Text, Image} from 'react-native';
import React from 'react';

interface EmptyListProps {
  message?: string;
}

const EmptyList = ({message}: EmptyListProps) => {
  return (
    <View className="flex justify-center items-center my-5 space-y-3">
      <Image
        className="w-36 h-36 shadow"
        source={require('assets/images/empty.png')}
      />
      <Text className="font-bold text-gray-400">
        {message || 'Data not found'}
      </Text>
    </View>
  );
};

export default EmptyList;
