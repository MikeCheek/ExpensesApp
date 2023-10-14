import {Animated, Easing, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {TrashIcon} from 'react-native-heroicons/outline';

interface RightSwipeActionsProps {
  onPress: () => void;
  dragX: Animated.AnimatedInterpolation<string | number>;
  progress: Animated.AnimatedInterpolation<string | number>;
}

const RightSwipeActions = ({
  onPress,
  dragX,
  progress,
}: RightSwipeActionsProps) => {
  const translate = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [50, 0, -50],
  });

  const scale = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.2, 1, 1.1],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['180deg', '0deg', '0deg'],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.3, 1, 2],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateX: translate,
          },
          {
            scale: scale,
          },
          {
            rotate: rotate,
          },
        ],
        opacity: opacity,
      }}
      className="flex-col justify-center items-center h-full ml-4 mr-2">
      <TouchableOpacity
        onPress={onPress}
        className="py-2 px-2 bg-[#FF0000] rounded-full flex-row items-center justify-center space-x-2">
        <TrashIcon size={24} color="white" />
        {Number(progress) > 2 ? (
          <Text className="text-white">Delete</Text>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default RightSwipeActions;
