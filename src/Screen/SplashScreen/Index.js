import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {scaleFont} from '../../utils/helper';

const SplashScreen = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      showsVerticalScrollIndicator={false}>
      <Text
        style={{color: '#fff', fontWeight: 'bold', fontSize: scaleFont(16)}}>
        APEL
      </Text>
    </View>
  );
};

export default SplashScreen;
