import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {Snackbar, TextInput} from 'react-native-paper';
import uuid from 'react-native-uuid';
import Button from '../../../Components/Botton/Button';
import ImagePickerForm from '../../../Components/ImagePicker';
import {scaleHeight, scaleWidth} from '../../../utils/helper';

const FormLapangan = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    nama: null,
    harga: null,
    image: null,
    jenis_lapangan: null,
  });

  const handleSelectImage = image => {
    setImage(image?.path);
    setForm(curForm => ({...curForm, image: image?.path}));
  };

  const onSubmit = () => {
    setLoading(true);
    if (!form.nama || form.nama?.length < 3) {
      setVisible(true);
      setLoading(false);
      return setMessage('Nama Lapangan minimal 3 karakter');
    } else if (!form.harga || form.harga < 1000) {
      setVisible(true);
      setLoading(false);
      return setMessage('Harga Lapangan minimal 1000');
    } else if (!form.image) {
      setVisible(true);
      setLoading(false);
      return setMessage('Gambar Lapangan harus diisi');
    } else if (!form.jenis_lapangan || form.jenis_lapangan?.length < 3) {
      setVisible(true);
      setLoading(false);
      return setMessage('Jenis Lapangan harus diisi');
    }

    // upload image
    const uri = form.image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    const uid = route?.params?.id || uuid.v4();
    const urlPath = `/lapangan/${uid}`;

    if (image) {
      storage()
        .ref('/lapangan/' + filename)
        .putFile(uploadUri)
        .then(res => {
          storage()
            .ref('/lapangan/' + filename)
            .getDownloadURL()
            .then(url => {
              database()
                .ref(urlPath)
                .set({...form, image: url})
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
            label={'Nama Lapangan'}
            mode={'outlined'}
            value={form.nama}
            style={{marginBottom: scaleHeight(2), borderColor: '#ddd'}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, nama: value}))
            }
          />
          <TextInput
            label={'Harga Sewa'}
            mode={'outlined'}
            value={form.harga}
            style={{marginBottom: scaleHeight(2), borderColor: '#ddd'}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, harga: value}))
            }
          />

          <TextInput
            label={'Jenis Lapangan'}
            mode={'outlined'}
            value={form.jenis_lapangan}
            style={{marginBottom: scaleHeight(2), borderColor: '#ddd'}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, jenis_lapangan: value}))
            }
          />

          <TextInput
            label={'Deskripsi'}
            mode={'outlined'}
            multiline={true}
            numberOfLines={4}
            value={form.deskripsi}
            style={{
              marginBottom: scaleHeight(2),
              borderColor: '#ddd',
              textAlignVertical: 'top',
            }}
            onChangeText={value =>
              setForm(curForm => ({...curForm, deskripsi: value}))
            }
          />

          <ImagePickerForm onCallback={handleSelectImage} path={form.image} />
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

export default FormLapangan;
