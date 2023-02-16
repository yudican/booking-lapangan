import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import Button from '../../../Components/Botton/Button';
import OnPress from '../../../Components/OnPress';
import {scaleHeight, scaleWidth, showAlert} from '../../../utils/helper';

const Register = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: null,
    nomor_telepon: null,
    email: null,
    password: null,
  });

  const handleRegister = () => {
    setLoading(true);

    if (!form.nama || form.nama?.length < 3) {
      setLoading(false);
      return showAlert('Nama Lengkap Tidak Boleh Kosong');
    } else if (!form.nomor_telepon || form.nomor_telepon?.length < 3) {
      setLoading(false);
      return showAlert('Nomor Telepon Tidak Boleh Kosong');
    } else if (!form.email || form.email?.length < 3) {
      setLoading(false);
      return showAlert('Email Tidak Boleh Kosong');
    } else if (!form.password || form.password?.length < 3) {
      setLoading(false);
      return showAlert('Password Tidak Boleh Kosong');
    }

    auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(res => {
        res.user.updateProfile({
          displayName: form.nama,
          phoneNumber: form.nomor_telepon,
        });
        database()
          .ref('user/' + res.user.uid)
          .set({
            nama: form.nama,
            nomor_telepon: form.nomor_telepon,
            email: form.email,
            role: 'member',
          })
          .then(() => {
            setLoading(false);
            showAlert('Register Berhasil');
          })
          .catch(error => {
            setLoading(false);
            showAlert('Register Berhasil');
          });
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        if (error.code === 'auth/email-already-in-use') {
          showAlert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          showAlert('That email address is invalid!');
        }
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          paddingHorizontal: scaleWidth(3),
          paddingVertical: scaleWidth(3),
          marginTop: scaleHeight(10),
        }}>
        <Text
          style={{
            color: '#000',
            textAlign: 'center',
          }}>
          Buat Akun
        </Text>
        <View>
          <TextInput
            label={'Nama Lengkap'}
            mode={'outlined'}
            style={{marginBottom: scaleHeight(2)}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, nama: value}))
            }
          />
          <TextInput
            label={'Nomor Telepon'}
            mode={'outlined'}
            style={{marginBottom: scaleHeight(2)}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, nomor_telepon: value}))
            }
          />
          <TextInput
            label={'Email'}
            mode={'outlined'}
            style={{marginBottom: scaleHeight(2)}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, email: value}))
            }
          />
          <TextInput
            label={'Kata Sandi'}
            mode={'outlined'}
            secureTextEntry
            style={{marginBottom: scaleHeight(2)}}
            onChangeText={value =>
              setForm(curForm => ({...curForm, password: value}))
            }
          />

          <Button
            title="Daftar Sekarang"
            onPress={handleRegister}
            loading={loading}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: scaleHeight(2),
            }}>
            <Text style={{color: '#000'}}>Sudah Punya Akun?</Text>
            <OnPress onPress={() => navigation.navigate('Login')}>
              <Text style={{marginLeft: scaleWidth(1), color: 'red'}}>
                Login
              </Text>
            </OnPress>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Register;
