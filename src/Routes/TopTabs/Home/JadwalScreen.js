import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  formatDate,
  mapObject,
  scaleFont,
  scaleHeight,
  scaleWidth,
} from '../../../utils/helper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Calendar} from 'react-native-calendars';
import Entypo from 'react-native-vector-icons/Entypo';
import OnPress from '../../../Components/OnPress';

const JadwalScreen = ({route}) => {
  const {lapanganId, image} = route.params;
  const [dataJadwalPertandingan, setDataJadwalPertandingan] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
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
            const tempData = mapObject(data) || [];
            setDataJadwalPertandingan(tempData);
          }
        });
    } else {
      database()
        .ref('/booking')
        .on('value', snapshot => {
          const data = snapshot.val();
          if (data) {
            const tempData = mapObject(data) || [];
            const finalData = tempData.map(item => {
              delete item.id;
              return mapObject(item);
            });

            const flattenData = finalData.flat();
            setDataJadwalPertandingan(flattenData);
          }
        });
    }
  }, []);

  const items2 = dataJadwalPertandingan.filter(item => {
    if (selectedDate) {
      return formatDate(new Date(item.tanggal)) === selectedDate;
    }

    return true;
  });
  const items = items2.filter(item => item?.lapangan?.id === lapanganId);
  if (items.length > 0) {
    return (
      <View style={{flex: 1, backgroundColor: '#f5f6fa'}}>
        <OnPress onPress={() => setShowCalendar(!showCalendar)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: scaleWidth(2),
              backgroundColor: '#fff',
              marginVertical: scaleHeight(1),
              marginHorizontal: scaleWidth(2),
              paddingVertical: scaleHeight(1),
              borderRadius: scaleWidth(1),
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: scaleFont(12),
                fontWeight: 'bold',
              }}>
              {selectedDate || 'Tampilkan Tanggal'}
            </Text>
            <Entypo
              name={selectedDate ? 'circle-with-cross' : 'chevron-down'}
              color={'#000'}
              onPress={() => {
                if (selectedDate) {
                  return setSelectedDate(null);
                }

                return setShowCalendar(!showCalendar);
              }}
            />
          </View>
        </OnPress>

        {showCalendar && (
          <View
            style={{
              marginHorizontal: scaleWidth(2),
              borderRadius: scaleWidth(2),
            }}>
            <Calendar
              // Handler which gets executed on day press. Default = undefined
              onDayPress={({timestamp}) => {
                setShowCalendar(false);
                setSelectedDate(formatDate(new Date(timestamp)));
              }}
            />
          </View>
        )}
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: scaleWidth(2),
            backgroundColor: '#f5f6fa',
          }}
          showsVerticalScrollIndicator={false}>
          {image && (
            <View
              style={{
                height: scaleHeight(20),
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Image
                source={{uri: image}}
                style={{
                  height: scaleHeight(20),
                  width: scaleWidth(95),
                  borderRadius: scaleHeight(1.5),
                }}
              />
            </View>
          )}
          {items.map((item, index) => (
            <Item item={item} key={index} />
          ))}
        </ScrollView>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,

        backgroundColor: '#fff',
      }}>
      <OnPress onPress={() => setShowCalendar(!showCalendar)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: scaleWidth(2),
            backgroundColor: '#fff',
            marginVertical: scaleHeight(1),
            marginHorizontal: scaleWidth(2),
            paddingVertical: scaleHeight(1),
            borderRadius: scaleWidth(1),
            borderWidth: 1,
            borderColor: '#eaeaea',
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: scaleFont(12),
              fontWeight: 'bold',
            }}>
            {selectedDate || 'Tampilkan Tanggal'}
          </Text>
          <Entypo
            name={selectedDate ? 'circle-with-cross' : 'chevron-down'}
            color={'#000'}
            onPress={() => {
              if (selectedDate) {
                return setSelectedDate(null);
              }

              return setShowCalendar(!showCalendar);
            }}
          />
        </View>
      </OnPress>
      {showCalendar && (
        <View
          style={{
            marginHorizontal: scaleWidth(2),
            borderRadius: scaleWidth(2),
          }}>
          <Calendar
            // Handler which gets executed on day press. Default = undefined
            onDayPress={({timestamp}) => {
              setShowCalendar(false);
              setSelectedDate(formatDate(new Date(timestamp)));
            }}
          />
        </View>
      )}
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Belum Ada Jadwal</Text>
      </View>
    </View>
  );
};

const Item = ({item}) => {
  const isPending = item?.konfirmasi?.status === 'pending';
  if (item?.tanggal) {
    return (
      <View style={style.containerItem}>
        <View style={{flex: 1}}>
          <View style={style.containerItemHeading}>
            <Text style={[style.titleItem, {color: '#0652DD'}]}>
              {formatDate(new Date(item?.tanggal))} {item?.jadwal?.jam_mulai} -{' '}
              {item?.jadwal?.jam_selesai}
            </Text>
          </View>

          <View style={style.containerItemContent}>
            <Text style={style.titleItemContent}>{item?.nama_tim_1}</Text>
            <Text style={style.titleItemContent}>{`VS`}</Text>
            <Text style={style.titleItemContent}>{item?.nama_tim_2}</Text>
          </View>

          <View style={style.containerItemHeading}>
            <Text style={[style.titleItem, {color: 'green'}]}>
              {item?.lapangan?.nama || '-'}
            </Text>

            <Text
              style={[
                style.titleItem,
                {color: isPending ? 'red' : item.colorMessage},
              ]}>
              {isPending ? 'Menunggu Dikonfirmasi' : item?.status}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
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
