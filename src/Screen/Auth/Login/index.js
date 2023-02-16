import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import Button from '../../../Components/Botton/Button';
import OnPress from '../../../Components/OnPress';
import {
  scaleFont,
  scaleHeight,
  scaleWidth,
  showAlert,
} from '../../../utils/helper';
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: null,
    password: null,
  });

  const handleLogin = () => {
    setLoading(true);

    if (!form.email || form.email?.length < 3) {
      setLoading(false);
      return showAlert('Email Tidak Boleh Kosong');
    } else if (!form.password || form.password?.length < 3) {
      setLoading(false);
      return showAlert('Password Tidak Boleh Kosong');
    }

    auth()
      .signInWithEmailAndPassword(form.email, form.password)
      .then(res => {
        setLoading(false);
        showAlert('Login Berhasil');
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
          marginTop: scaleHeight(20),
        }}>
        <Text
          style={{
            color: '#000',
            textAlign: 'center',
          }}>
          Login
        </Text>
        <View>
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
            style={{marginBottom: scaleHeight(2)}}
            secureTextEntry
            onChangeText={value =>
              setForm(curForm => ({...curForm, password: value}))
            }
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <OnPress onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={{marginLeft: scaleWidth(1), color: '#0652DD'}}>
                Lupa Kata Sandi?
              </Text>
            </OnPress>
          </View>

          <Button title="Masuk" onPress={handleLogin} loading={loading} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: scaleHeight(2),
            }}>
            <Text style={{color: '#000'}}>Belum Punya Akun?</Text>
            <OnPress onPress={() => navigation.navigate('Register')}>
              <Text style={{marginLeft: scaleWidth(1), color: '#0652DD'}}>
                Daftar
              </Text>
            </OnPress>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
