import React, {useEffect, useState} from 'react';

import database from '@react-native-firebase/database';
import {Image, ScrollView, Text, View} from 'react-native';
import OnPress from '../../Components/OnPress';
import {
  formatCurrency,
  mapObject,
  scaleFont,
  scaleHeight,
  scaleWidth,
} from '../../utils/helper';

const ListLapangan = ({navigation}) => {
  const [lapangan, setLapangan] = useState([]);

  useEffect(() => {
    database()
      .ref('/lapangan')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setLapangan(mapObject(data));
        }
      });
  }, []);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#fff'}}
      showsVerticalScrollIndicator={false}>
      {lapangan.map((item, index) => (
        <ItemLapangan
          key={item.id}
          item={item}
          onPress={() => navigation.navigate('DetailLapangan', {item})}
        />
      ))}
    </ScrollView>
  );
};

const ItemLapangan = ({item, onPress}) => {
  return (
    <OnPress onPress={onPress}>
      <View
        style={{
          justifyContent: 'center',
          marginTop: scaleHeight(3),
          paddingHorizontal: scaleWidth(3),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            borderWidth: 1,
            borderColor: '#eaeaea',
            padding: scaleWidth(2),
            borderRadius: scaleHeight(1),
          }}>
          <Image
            source={{uri: item.image}}
            style={{
              backgroundColor: '#0652DD',
              height: scaleHeight(7.5),
              width: scaleWidth(20),
              borderRadius: scaleHeight(1),
            }}
          />

          <View style={{marginLeft: scaleWidth(3)}}>
            <Text
              style={{
                color: '#000',
                fontSize: scaleFont(16),
                fontWeight: 'bold',
                width: scaleWidth(70),
              }}>
              {item.nama}
            </Text>
            {item?.jenis_lapangan && (
              <Text
                style={{
                  color: 'green',
                  fontSize: scaleFont(12),
                  width: scaleWidth(70),
                }}>
                {item?.jenis_lapangan}
              </Text>
            )}

            <Text
              style={{
                color: '#0652DD',
                fontSize: scaleFont(14),
                fontWeight: 'bold',
              }}>
              {formatCurrency(item.harga)}
            </Text>
          </View>
        </View>
      </View>
    </OnPress>
  );
};

export default ListLapangan;
