import database from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Snackbar, TextInput} from 'react-native-paper';
import uuid from 'react-native-uuid';
import Button from '../../Components/Botton/Button';
import {scaleHeight, scaleWidth} from '../../utils/helper';

const RejectPayment = ({navigation, route}) => {
  const uid = uuid.v4();
  const {urlPayment, urlRoot, item} = route?.params;
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    note: null,
  });

  const onSubmit = () => {
    setLoading(true);
    if (!form.note || form.note?.length < 3) {
      setVisible(true);
      setLoading(false);
      return setMessage('Catatan Tidak Boleh Kosong');
    }

    database()
      .ref(urlRoot)
      .set({...item, status: 'Pembayaran Ditolak', colorMessage: '#0652DD'})
      .then(() => {
        database()
          .ref(`/notifikasi/${item.user_id}/${uid}`)
          .set({
            title: 'Pembayarn Ditolak',
            body: `Mohon Pembayaran Order Anda #${item.tanggal} kami tolak dengan.`,
            extraText: form.note,
            date: new Date().getTime(),
          })
          .then(() => {});
        database()
          .ref(`/booked-list/${item?.id}`)
          .remove()
          .then(() => {});
        database()
          .ref(urlPayment)
          .set({...item.konfirmasi, ...form, status: 'rejected'})
          .then(() => {
            setVisible(true);
            setLoading(false);
            setMessage('Data berhasil disimpan');
            return navigation.goBack();
          });
      });
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setVisible(false);
      }, 1000);
    }
  }, [visible]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        style={{zIndex: 9999}}>
        {message}
      </Snackbar>
      <View
        style={{
          flex: 1,
          paddingHorizontal: scaleWidth(3),
          paddingVertical: scaleWidth(3),
        }}>
        <View>
          <TextInput
            label={'Catatan'}
            mode={'outlined'}
            placeholder={'Masukan Catatan Penolakan'}
            value={form.note}
            style={{marginBottom: scaleHeight(2), borderColor: '#ddd'}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, note: value}))
            }
          />
        </View>
      </View>
      <View
        style={{
          marginHorizontal: scaleWidth(3),
          marginVertical: scaleHeight(2),
        }}>
        <Button title="Tolak Pembayaran" onPress={onSubmit} loading={loading} />
      </View>
    </View>
  );
};

export default RejectPayment;
