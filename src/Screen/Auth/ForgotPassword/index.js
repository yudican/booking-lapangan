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

const ForgotPassword = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: null,
  });

  const handleSendEmail = () => {
    setLoading(true);

    if (!form.email || form.email?.length < 3) {
      setLoading(false);
      return showAlert('Email Tidak Boleh Kosong');
    }

    auth()
      .sendPasswordResetEmail(form.email)
      .then(res => {
        setLoading(false);
        showAlert('Link Reset Password Berhasil Dikirim');
        return navigation.replace('Login');
      })
      .catch(error => {
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
          Lupa Kata Sandi
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

          <Button
            title="KIRIM LINK"
            onPress={handleSendEmail}
            loading={loading}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: scaleHeight(2),
            }}>
            <Text style={{color: '#000'}}>Ingat Kata Sandi?</Text>
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

export default ForgotPassword;
