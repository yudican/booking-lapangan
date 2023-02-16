import React, {useEffect, useState} from 'react';

import {ScrollView, StyleSheet, Text, View} from 'react-native';
import OnPress from '../../Components/OnPress';
import {
  formatDate,
  mapObject,
  scaleFont,
  scaleHeight,
  scaleWidth,
} from '../../utils/helper';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const NotificationDetail = ({navigation, route}) => {
  const {item} = route.params;

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: scaleWidth(3),
        paddingVertical: scaleHeight(2),
        backgroundColor: '#fff',
      }}>
      <Text style={{color: '#000'}}>{item.body}</Text>
      {item?.extraText && (
        <Text
          style={{
            color: '#000',
            marginTop: scaleHeight(2),
            fontWeight: 'bold',
          }}>
          {item?.extraText}
        </Text>
      )}
    </View>
  );
};

export default NotificationDetail;
