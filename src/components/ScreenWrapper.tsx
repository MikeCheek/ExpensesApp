import React from 'react';
import {View, StatusBar, Platform, ViewProps, Dimensions} from 'react-native';
import {AvoidSoftInputView} from 'react-native-avoid-softinput';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
}

const ScreenWrapper = ({children, ...props}: ScreenWrapperProps) => {
  const statusBarHeight = StatusBar.currentHeight
    ? StatusBar.currentHeight
    : Platform.OS === 'ios'
    ? 30
    : 0;
  const windowHeight = Dimensions.get('window').height;
  return (
    <AvoidSoftInputView
      avoidOffset={15}
      easing="easeOut"
      hideAnimationDelay={0}
      hideAnimationDuration={100}
      showAnimationDelay={0}
      showAnimationDuration={100}
      style={{
        marginTop: statusBarHeight,
        height: windowHeight - statusBarHeight,
        maxHeight: windowHeight - statusBarHeight,
      }}
      {...props}>
      {children}
    </AvoidSoftInputView>
  );
};

export default ScreenWrapper;
