import React, {useEffect, useState} from 'react';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import uuid from 'react-native-uuid';
import Button from '../../Components/Botton/Button';
import OnPress from '../../Components/OnPress';
import {
  formatDate,
  mapObject,
  scaleFont,
  scaleHeight,
  scaleWidth,
  showAlert,
} from '../../utils/helper';

const DetailLapangan = ({navigation, route}) => {
  const {item} = route.params;
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [jadwals, setJadwals] = useState([]);
  const [metodePembayaran, setMetodePembayaran] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMetodePembayaran, setSelectedMetodePembayaran] =
    useState(null);
  const [bookedLists, setBookedLists] = useState([]);

  const [form, setForm] = useState({
    tanggal: '',
    jadwal: null,
    metodePembayaran: null,
    lapangan: item,
    status: 'Menunggu Pembayaran',
    colorMessage: '#f0932b',
  });

  useEffect(() => {
    database()
      .ref('/booked-list')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const bookedList = mapObject(data);
          const newData = bookedList.filter(
            booked => booked.lapangan_id === item.id,
          );
          setBookedLists(newData);
        }
      });
    database()
      .ref('/jadwal')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const jadwalList = mapObject(data);
          const newJadwal = jadwalList.map(jadwal => {
            if (bookedLists.find(booked => booked.jadwal_id === jadwal.id)) {
              return {
                ...jadwal,
                disabled: true,
              };
            }
            return {
              ...jadwal,
              disabled: false,
            };
          });
          setJadwals(newJadwal);
        }
      });

    database()
      .ref('/metode-pembayaran')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setMetodePembayaran(mapObject(data));
        }
      });

    setForm({
      jadwal: null,
      metodePembayaran: null,
      lapangan: item,
      status: 'Menunggu Pembayaran',
      colorMessage: '#f0932b',
    });
  }, []);

  const handleBooking = () => {
    if (!selectedDate) {
      return showAlert('Pilih Tanggal');
    }

    if (!selectedJadwal) {
      return showAlert('Pilih Jadwal');
    }

    if (!selectedMetodePembayaran) {
      return showAlert('Pilih Metode Pembayaran');
    }

    setLoading(true);
    const uid = uuid.v4();
    const user = auth().currentUser;
    const urlPath = `/booking/${user.uid}/${uid}`;
    database()
      .ref(urlPath)
      .set({...form, user_id: user.uid, id: uid})
      .then(() => {
        database()
          .ref(`/booked-list/${uid}`)
          .set({
            jadwal_id: form?.jadwal?.id,
            lapangan_id: form?.lapangan?.id,
            tanggal: formatDate(new Date(form.tanggal)),
          })
          .then(() => {});
        setLoading(false);
        showAlert('Berhasil Booking');
        setForm({
          jadwal: null,
          metodePembayaran: null,
          lapangan: item,
          status: 'Menunggu Pembayaran',
          colorMessage: '#f0932b',
        });
        return navigation.navigate('KonfirmasiPembayaran', {
          id: uid,
          user_id: user.uid,
        });
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f5f6fa'}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.image}>
            <Image source={{uri: item.image}} style={styles.image} />
          </View>
          <View style={styles.text}>
            <Text style={styles.textTitle}>{item.nama}</Text>
            <Text style={styles.textPrice}>Rp. {item.harga}</Text>
          </View>
        </View>
        <View style={[styles.content, {marginTop: scaleHeight(1)}]}>
          <Text style={styles.textTitle}>Deskripsi Lapangan</Text>
          <Text style={styles.textDesc}>{item.deskripsi}</Text>
        </View>

        {/* Tanggal */}
        <View style={[styles.content, {marginTop: scaleHeight(1)}]}>
          <Text style={[styles.textTitle, {paddingBottom: scaleHeight(1)}]}>
            Pilih Tanggal
          </Text>
          <View
            style={{
              borderTopColor: '#f5f6fa',
              borderTopWidth: 1,
            }}>
            <Button
              title={selectedDate ? selectedDate : 'Pilih Tanggal'}
              color={selectedDate ? 'blue' : '#95afc0'}
              onPress={() => setOpen(true)}
            />
            <DatePicker
              modal
              mode="date"
              open={open}
              date={date}
              minimumDate={new Date()}
              onConfirm={date => {
                setOpen(false);
                setDate(date);
                setSelectedDate(formatDate(date));
                setForm(formData => ({
                  ...formData,
                  tanggal: new Date(date).getTime(),
                }));

                const newJadwal = jadwals.map(jadwal => {
                  const jadwalSelected = bookedLists.find(
                    booked =>
                      booked.jadwal_id === jadwal.id &&
                      formatDate(date) === booked.tanggal,
                  );
                  if (jadwalSelected) {
                    return {
                      ...jadwal,
                      disabled: true,
                    };
                  }
                  setSelectedJadwal(null);
                  setForm(formData => ({...formData, jadwal: null}));
                  return {
                    ...jadwal,
                    disabled: false,
                  };
                });
                setJadwals(newJadwal);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
        </View>

        {/* jadwal */}
        <View style={[styles.content, {marginTop: scaleHeight(1)}]}>
          <Text style={[styles.textTitle, {paddingBottom: scaleHeight(1)}]}>
            Pilih Jadwal
          </Text>
          <View
            style={{
              borderTopColor: '#f5f6fa',
              borderTopWidth: 1,
              paddingTop: scaleHeight(2),
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              {jadwals &&
                jadwals.map((item, index) => (
                  <OnPress
                    onPress={() => {
                      if (item.disabled) {
                        return showAlert(
                          'Lapangan sudah dibooking orang lain.',
                        );
                      }
                      setSelectedJadwal(item.id);
                      setForm(formData => ({...formData, jadwal: item}));
                    }}>
                    <View
                      style={[
                        styles.time,
                        {
                          borderColor:
                            selectedJadwal === item.id ? 'red' : '#eaeaea',
                        },
                      ]}
                      key={index}>
                      <Text
                        style={{
                          paddingVertical: scaleHeight(1),
                          fontSize: scaleFont(14),
                          fontWeight: 'bold',
                        }}>
                        {`${item.jam_mulai} - ${item.jam_selesai}`}
                      </Text>
                    </View>
                  </OnPress>
                ))}
            </View>
          </View>
        </View>

        {/* metode pembayaran */}
        <View style={[styles.content, {marginTop: scaleHeight(1)}]}>
          <Text style={[styles.textTitle, {paddingBottom: scaleHeight(1)}]}>
            Pilih Metode Pembayaran
          </Text>
          <View
            style={{
              borderTopColor: '#f5f6fa',
              borderTopWidth: 1,
              paddingTop: scaleHeight(2),
            }}>
            {metodePembayaran &&
              metodePembayaran.map((item, index) => (
                <OnPress
                  onPress={() => {
                    setSelectedMetodePembayaran(item.id);
                    setForm(formData => ({
                      ...formData,
                      metodePembayaran: item,
                    }));
                  }}>
                  <View
                    style={[
                      styles.containerItem,
                      {
                        borderColor:
                          selectedMetodePembayaran === item.id
                            ? 'red'
                            : '#eaeaea',
                      },
                    ]}
                    key={index}>
                    <Image source={{uri: item.logo}} style={styles.imageItem} />
                    <View style={{marginLeft: scaleWidth(3)}}>
                      <Text style={styles.titleItem}>{item.nama_bank}</Text>
                      <Text style={styles.titleItem}>
                        {item.nama_rekening} - {item.nomor_rekening}
                      </Text>
                    </View>
                  </View>
                </OnPress>
              ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Booking Sekarang"
          onPress={() => handleBooking()}
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(3),
    paddingVertical: scaleHeight(2),
  },
  title: {
    fontSize: scaleFont(13),
    color: '#000',
    marginLeft: scaleWidth(3),
  },
  content: {
    backgroundColor: '#fff',
    paddingHorizontal: scaleWidth(3),
    paddingVertical: scaleHeight(2),
  },
  image: {
    height: scaleHeight(30),
    borderRadius: scaleWidth(1),
  },
  text: {
    marginTop: scaleHeight(2),
  },
  textTitle: {
    fontSize: scaleFont(13),
    color: '#000',
    fontWeight: 'bold',
  },
  textPrice: {
    fontSize: scaleFont(13),
    color: 'red',
    fontWeight: 'bold',
  },
  textDesc: {
    fontSize: scaleFont(13),
    color: '#000',
    paddingTop: scaleHeight(1),
  },
  time: {
    width: scaleWidth(45),
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: scaleWidth(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleHeight(1),
  },
  footer: {
    paddingHorizontal: scaleWidth(3),
    paddingBottom: scaleHeight(1),
    backgroundColor: '#fff',
  },

  // metode pembayaran
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#eaeaea',
    padding: scaleWidth(2),
    borderRadius: scaleHeight(1),
    backgroundColor: '#fff',
    marginBottom: scaleHeight(1),
  },
  imageItem: {
    backgroundColor: '#eaeaea',
    height: scaleHeight(6),
    width: scaleWidth(15),
    borderRadius: scaleHeight(1),
  },
  titleItem: {
    color: '#000',
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    width: scaleWidth(66),
  },
});

export default DetailLapangan;
