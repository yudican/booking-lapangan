import React from 'react';
import {TouchableOpacity} from 'react-native';

const OnPress = ({children, onPress, style}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={style}>
      {children}
    </TouchableOpacity>
  );
};

export default OnPress;
