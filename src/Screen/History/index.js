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

const History = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    const uid = auth().currentUser.uid;
    database()
      .ref('/user/' + uid)
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setUser(data);
        }
      });

    if (user?.role === 'member') {
      database()
        .ref('/booking/' + uid)
        .on('value', snapshot => {
          const data = snapshot.val();
          if (data) {
            setLoading(false);
            const tempData = mapObject(data) || [];
            setOrders(tempData);
          }
        });
    } else {
      database()
        .ref('/booking')
        .on('value', snapshot => {
          const data = snapshot.val();
          if (data) {
            setLoading(false);
            const tempData = mapObject(data) || [];
            const finalData = tempData.map(item => {
              delete item.id;
              return mapObject(item);
            });

            const flattenData = finalData.flat();
            setOrders(flattenData);
          }
        });
    }
  }, []);
  console.log(orders, 'orders');
  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Daftar Pesanan</Text>
      </View>
      <ScrollView
        style={{flex: 1, backgroundColor: '#f5f5f5'}}
        showsVerticalScrollIndicator={false}>
        {orders.map((item, index) => {
          return (
            <HistoryItem
              item={item}
              key={index}
              onPress={() => navigation.navigate('HistoryDetail', {item})}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const HistoryItem = ({item, onPress}) => {
  return (
    <OnPress onPress={onPress}>
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <Text style={styles.itemOrderId}>#{item.tanggal}</Text>
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
          {formatDate(new Date(item.tanggal))}
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

export default History;
