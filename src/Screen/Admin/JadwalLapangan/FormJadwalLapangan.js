import database from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Snackbar} from 'react-native-paper';
import uuid from 'react-native-uuid';
import Button from '../../../Components/Botton/Button';
import DateTimePicker from '../../../Components/DateTimePicker/DateTimePicker';
import {formatTime, scaleHeight, scaleWidth} from '../../../utils/helper';

const FormJadwalLapangan = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    jam_mulai: null,
    jam_selesai: null,
  });

  const onSubmit = () => {
    setLoading(true);
    if (!form.jam_mulai || form.jam_mulai?.length < 3) {
      setVisible(true);
      setLoading(false);
      return setMessage('Jam Mulai Tidak Boleh Kosong');
    } else if (!form.jam_selesai || form.jam_selesai?.length < 3) {
      setVisible(true);
      setLoading(false);
      return setMessage('Jam Selesai Tidak Boleh Kosong');
    }
    const uid = route?.params?.id || uuid.v4();
    const urlPath = `/jadwal/${uid}`;

    database()
      .ref(urlPath)
      .set({...form, id: uid})
      .then(() => {
        setVisible(true);
        setLoading(false);
        setMessage('Data berhasil disimpan');
        return navigation.goBack();
      });
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setVisible(false);
      }, 1000);
    }
  }, [visible, route]);

  useEffect(() => {
    if (route?.params) {
      setForm(route?.params);
    }
  }, [route]);

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
          <DateTimePicker
            label={'Jam Mulai'}
            placeholder={'09.00'}
            mode={'time'}
            value={form.jam_mulai}
            onChange={date =>
              setForm(formData => ({
                ...formData,
                jam_mulai: formatTime(date),
              }))
            }
          />

          <DateTimePicker
            label={'Jam Selesai'}
            placeholder={'10.00'}
            mode={'time'}
            value={form.jam_selesai}
            onChange={date =>
              setForm(formData => ({
                ...formData,
                jam_selesai: formatTime(date),
              }))
            }
          />
        </View>
      </View>
      <View
        style={{
          marginHorizontal: scaleWidth(3),
          marginVertical: scaleHeight(2),
        }}>
        <Button title="Simpan" onPress={onSubmit} loading={loading} />
      </View>
    </View>
  );
};

export default FormJadwalLapangan;
