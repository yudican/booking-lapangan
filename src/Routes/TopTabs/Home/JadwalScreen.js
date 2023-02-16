import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  formatDate,
  mapObject,
  scaleFont,
  scaleHeight,
  scaleWidth,
} from '../../../utils/helper';
import database from '@react-native-firebase/database';

const JadwalScreen = ({route}) => {
  const {lapanganId} = route.params;
  const [dataJadwalPertandingan, setDataJadwalPertandingan] = useState([]);

  useEffect(() => {
    database()
      .ref('/lapangan/' + lapanganId)
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const tempData = mapObject(data.jadwal) || [];
          setDataJadwalPertandingan(tempData);
        }
      });
  }, []);
  if (dataJadwalPertandingan.length > 0) {
    return (
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: scaleWidth(2),
          backgroundColor: '#f5f6fa',
        }}
        showsVerticalScrollIndicator={false}>
        {dataJadwalPertandingan.map((item, index) => (
          <Item item={item} key={index} />
        ))}
      </ScrollView>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Text>Belum Ada Jadwal</Text>
    </View>
  );
};

const Item = ({item}) => {
  return (
    <View style={style.containerItem}>
      <View style={{flex: 1}}>
        <View style={style.containerItemHeading}>
          <Text style={[style.titleItem, {color: '#0652DD'}]}>
            {formatDate(new Date(item.tanggal_pertandingan))}{' '}
            {item.jadwal.waktu}
          </Text>
        </View>

        <View style={style.containerItemContent}>
          <Text style={style.titleItemContent}>{item.nama_tim_1}</Text>
          <Text style={style.titleItemContent}>{`VS`}</Text>
          <Text style={style.titleItemContent}>{item.nama_tim_2}</Text>
        </View>

        <View style={style.containerItemHeading}>
          <Text style={[style.titleItem, {color: 'green'}]}>
            {item.lapangan.nama}
          </Text>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  containerItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#eaeaea',
    padding: scaleWidth(2),
    borderRadius: scaleHeight(1),
    backgroundColor: '#fff',
    marginBottom: scaleHeight(1),
    marginTop: scaleHeight(2),
  },
  containerItemHeading: {
    flex: 1,
    marginLeft: scaleWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#f5f6fa',
    borderBottomWidth: 1,
    paddingBottom: scaleHeight(0.5),
  },
  containerItemContent: {
    flex: 1,
    marginLeft: scaleWidth(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#f5f6fa',
    borderBottomWidth: 1,
    paddingVertical: scaleHeight(0.5),
  },

  titleItem: {
    color: '#000',
    fontSize: scaleFont(16),
    fontWeight: 'bold',
  },
  titleItemContent: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: scaleFont(18),
    textTransform: 'uppercase',
  },
});

export default JadwalScreen;
