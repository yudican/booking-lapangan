import React, {useEffect, useState} from 'react';

import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import uuid from 'react-native-uuid';
import {
  formatDate,
  scaleFont,
  scaleHeight,
  scaleWidth,
  showAlert,
} from '../../utils/helper';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Button from '../../Components/Botton/Button';

const HistoryDetail = ({navigation, route}) => {
  const {item} = route.params;
  const [user, setUser] = useState(null);

  useEffect(() => {
    database()
      .ref('/user/' + auth().currentUser.uid)
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setUser(data);
        }
      });
  }, []);
  const uid = uuid.v4();
  const urlPayment = `/booking/${item.user_id}/${item?.konfirmasi?.id}/konfirmasi`;
  const urlRoot = `/booking/${item.user_id}/${item?.konfirmasi?.id}`;

  const approvePayment = () => {
    database()
      .ref(urlRoot)
      .set({...item, status: 'Pembayaran Diterima', colorMessage: 'green'})
      .then(() => {
        database()
          .ref(urlPayment)
          .set({...item?.konfirmasi, status: 'approved'})
          .then(() => {
            database()
              .ref(`/notifikasi/${item.user_id}/${uid}`)
              .set({
                title: 'Pembayarn diterima',
                body: `Pembayaran Order Anda #${item.tanggal} berhasil di verifikasi oleh admin.`,
                date: new Date().getTime(),
              })
              .then(() => {
                showAlert('Pembayaran berhasil diterima');
              });
          });
      });
  };

  const deleteOrder = () => {
    database()
      .ref(`/notifikasi/${item.user_id}/${uid}`)
      .set({
        title: 'Order Dihapus',
        body: `Order Anda #${item.tanggal} telah dihapus oleh admin karena tidak melakukan pembayaran dalam waktu 1x24 jam`,
        date: new Date().getTime(),
      })
      .then(() => {
        database()
          .ref(`/booking/${item.user_id}/${item?.id}`)
          .remove()
          .then(() => {
            database()
              .ref(`/booked-list/${item?.id}`)
              .remove()
              .then(() => {});
            showAlert('Order berhasil dihapus');
            return navigation.goBack();
          });
      });
  };

  const confirmOrder = () => {
    database()
      .ref(`/booked-list/${item?.id}`)
      .remove()
      .then(() => {
        database()
          .ref(`/notifikasi/${item.user_id}/${uid}`)
          .set({
            title: 'Selesai',
            body: `Order Anda #${item.tanggal} telah ditandai selesai oleh admin.`,
            date: new Date().getTime(),
          })
          .then(() => {
            database()
              .ref(urlRoot)
              .set({
                ...item,
                status: 'Selesai',
                colorMessage: 'green',
              })
              .then(() => {
                showAlert('Konfirmasi Berhasil');
                return navigation.goBack();
              });
          });
      });
  };

  const canApprovePayment =
    item?.konfirmasi?.status === 'pending' && user?.role === 'admin';

  const canConfirmPayment = item?.konfirmasi && user?.role === 'member';
  const canDeleteOrder = user?.role === 'admin';
  const canConfirmOrder = item?.status === 'Pembayaran Diterima';
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {/* rincian pesanan */}
        <View style={[styles.content, {marginTop: scaleHeight(1)}]}>
          <Text style={[styles.textTitle, {paddingBottom: scaleHeight(1)}]}>
            Rincian Pesanan
          </Text>

          <View
            style={{
              borderTopColor: '#f5f6fa',
              borderTopWidth: 1,
            }}>
            <ItemList label={'Nomor Pesanan'} value={`#${item.tanggal}`} />
            <ItemList
              label={'Status'}
              value={item?.status}
              color={item.colorMessage}
            />
            <ItemList label={'Lapangan'} value={`${item.lapangan.nama}`} />
            <ItemList
              label={'Tanggal'}
              value={formatDate(new Date(item.tanggal))}
            />
            <ItemList label={'Jam Mulai'} value={item.jadwal.jam_mulai} />
            <ItemList label={'Jam Selesai'} value={item.jadwal.jam_selesai} />
          </View>
        </View>

        {/* info pelanggan */}
        <View style={[styles.content, {marginTop: scaleHeight(1)}]}>
          <Text style={[styles.textTitle, {paddingBottom: scaleHeight(1)}]}>
            Info Pelanggan
          </Text>
          <View
            style={{
              borderTopColor: '#f5f6fa',
              borderTopWidth: 1,
            }}>
            <ItemList label={'Nama'} value={user?.nama} />
            <ItemList label={'Telepon'} value={user?.nomor_telepon} />
          </View>
        </View>

        {/* info pembayaran */}
        {item?.konfirmasi && (
          <View style={[styles.content, {marginTop: scaleHeight(1)}]}>
            <Text style={[styles.textTitle, {paddingBottom: scaleHeight(1)}]}>
              Rincian Pembayaran
            </Text>
            <View
              style={{
                borderTopColor: '#f5f6fa',
                borderTopWidth: 1,
              }}>
              <ItemList
                label={'Nama Bank'}
                value={item?.konfirmasi?.nama_bank}
              />
              <ItemList
                label={'Nama Rekening'}
                value={item?.konfirmasi?.nama_rekening}
              />
              <ItemList
                label={'Nominal Transfer'}
                value={item?.konfirmasi?.nominal}
              />
              <ItemList
                label={'Status Pembayaran'}
                value={item?.konfirmasi?.status}
              />
              <ItemList label={'Catatan'} value={item?.konfirmasi?.note} />
              <ItemList label={'Bukti Transfer'} value={null} />
              <View style={{paddingTop: scaleHeight(2)}}>
                <Image
                  source={{uri: item?.konfirmasi?.bukti_transfer}}
                  style={{width: scaleWidth(30), height: scaleHeight(20)}}
                />
              </View>
              {canApprovePayment && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{width: scaleWidth(45)}}>
                    <Button
                      color="green"
                      title="Terima"
                      onPress={() => approvePayment()}
                    />
                  </View>
                  <View style={{width: scaleWidth(45)}}>
                    <Button
                      title="Tolak"
                      onPress={() =>
                        navigation.navigate('RejectPayment', {
                          urlPayment,
                          urlRoot,
                          item,
                        })
                      }
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {canConfirmPayment && (
        <View style={styles.footer}>
          <Button
            title="Konfirmasi Pembayaran"
            onPress={() => {
              return navigation.navigate('KonfirmasiPembayaran', {
                id: item?.id,
                user_id: item?.user_id,
              });
            }}
          />
        </View>
      )}
      {canDeleteOrder && (
        <View style={styles.footer}>
          <Button title="Hapus Order" onPress={() => deleteOrder()} />
        </View>
      )}
      {canConfirmOrder && (
        <View style={styles.footer}>
          <Button title="Konfirmasi Selesai" onPress={() => confirmOrder()} />
        </View>
      )}
    </View>
  );
};

const ItemList = ({label, value, color = '#000'}) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{label}</Text>
      <Text style={[styles.textTitle, {color}]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },

  content: {
    backgroundColor: '#fff',
    paddingHorizontal: scaleWidth(3),
    paddingVertical: scaleHeight(2),
  },
  textTitle: {
    fontSize: scaleFont(13),
    color: '#000',
    fontWeight: 'bold',
  },
  title: {
    fontSize: scaleFont(13),
    color: '#000',
  },
  textPrice: {
    fontSize: scaleFont(13),
    color: '#0652DD',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scaleHeight(1),
  },
  footer: {
    paddingHorizontal: scaleWidth(3),
    paddingBottom: scaleHeight(1),
    backgroundColor: '#fff',
  },
});

export default HistoryDetail;
