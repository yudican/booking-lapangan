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

const Notification = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setLoading(true);
    const uid = auth().currentUser.uid;
    database()
      .ref('/notifikasi/' + uid)
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const tempData = mapObject(data) || [];
          setNotifications(tempData);
        }
      });
  }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1, backgroundColor: '#f5f5f5'}}
        showsVerticalScrollIndicator={false}>
        {notifications.map((item, index) => {
          return (
            <NotificationItem
              item={item}
              key={index}
              onPress={() =>
                navigation.navigate('NotificationDetail', {
                  item,
                  title: item.title,
                })
              }
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const NotificationItem = ({item, onPress}) => {
  return (
    <OnPress onPress={onPress}>
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <Text style={styles.itemOrderId}>{item.title}</Text>
          <Text
            style={{
              fontSize: scaleFont(12),
              fontWeight: 'bold',
              color: item.colorMessage,
            }}>
            {item.status}
          </Text>
        </View>
        <Text style={{fontSize: scaleFont(12), color: '#000'}}>
          {formatDate(new Date(item.date))}
        </Text>
      </View>
    </OnPress>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: scaleHeight(2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: {fontSize: scaleFont(14), fontWeight: 'bold', color: '#000'},
  itemContainer: {
    marginHorizontal: scaleWidth(3),
    paddingVertical: scaleHeight(1.4),
    backgroundColor: '#fff',
    paddingHorizontal: scaleWidth(3),
    borderRadius: scaleWidth(2),
    marginTop: scaleHeight(2),
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemOrderId: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Notification;
