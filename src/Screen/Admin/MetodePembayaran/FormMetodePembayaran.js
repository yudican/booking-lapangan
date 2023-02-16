import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {Snackbar, TextInput} from 'react-native-paper';
import uuid from 'react-native-uuid';
import Button from '../../../Components/Botton/Button';
import ImagePickerForm from '../../../Components/ImagePicker';
import {scaleHeight, scaleWidth} from '../../../utils/helper';

const FormMetodePembayaran = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    nama_bank: null,
    nama_rekening: null,
    nomor_rekening: null,
    logo: null,
  });

  const handleSelectImage = image => {
    setImage(image?.path);
    setForm(curForm => ({...curForm, logo: image?.path}));
  };

  const onSubmit = () => {
    setLoading(true);
    if (!form.nama_bank || form.nama_bank?.length < 3) {
      setVisible(true);
      setLoading(false);
      return setMessage('Nama Bank minimal 3 karakter');
    } else if (!form.nama_rekening || form.nama_rekening?.length < 3) {
      setVisible(true);
      setLoading(false);
      return setMessage('Nama Rekening minimal 3 karakter');
    } else if (!form.nomor_rekening || form.nomor_rekening?.length < 3) {
      setVisible(true);
      setLoading(false);
      return setMessage('Nomor Rekening minimal 3 karakter');
    } else if (!form.logo) {
      setVisible(true);
      setLoading(false);
      return setMessage('Logo Bank harus diisi');
    }

    // upload image
    const uri = form.logo;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    const uid = route?.params?.id || uuid.v4();
    const urlPath = `/metode-pembayaran/${uid}`;

    if (image) {
      storage()
        .ref('/metode-pembayaran/' + filename)
        .putFile(uploadUri)
        .then(res => {
          storage()
            .ref('/metode-pembayaran/' + filename)
            .getDownloadURL()
            .then(url => {
              database()
                .ref(urlPath)
                .set({...form, logo: url})
                .then(() => {
                  setVisible(true);
                  setLoading(false);
                  setMessage('Data berhasil disimpan');
                  return navigation.goBack();
                });
            });
        });
    } else {
      database()
        .ref(urlPath)
        .set(form)
        .then(() => {
          setVisible(true);
          setLoading(false);
          setMessage('Data berhasil disimpan');
          return navigation.goBack();
        });
    }
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
          <TextInput
            label={'Nama Bank'}
            mode={'outlined'}
            value={form.nama_bank}
            style={{marginBottom: scaleHeight(2), borderColor: '#ddd'}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, nama_bank: value}))
            }
          />
          <TextInput
            label={'Nama Rekening Bank'}
            mode={'outlined'}
            value={form.nama_rekening}
            style={{marginBottom: scaleHeight(2), borderColor: '#ddd'}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, nama_rekening: value}))
            }
          />
          <TextInput
            label={'Nomor Rekening Bank'}
            mode={'outlined'}
            value={form.nomor_rekening}
            style={{marginBottom: scaleHeight(2), borderColor: '#ddd'}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, nomor_rekening: value}))
            }
          />

          <ImagePickerForm onCallback={handleSelectImage} path={form.logo} />
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

export default FormMetodePembayaran;
