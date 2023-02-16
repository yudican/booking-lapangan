import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import MasterBanner from '../Screen/Admin/MasterBanner';
import Login from '../Screen/Auth/Login';
import Register from '../Screen/Auth/Register';
import BottomTabs from './BottomTabs';

import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DataLapangan from '../Screen/Admin/DataLapangan';
import FormLapangan from '../Screen/Admin/DataLapangan/FormLapangan';
import JadwalLapangan from '../Screen/Admin/JadwalLapangan';
import FormJadwalLapangan from '../Screen/Admin/JadwalLapangan/FormJadwalLapangan';
import MasterBannerForm from '../Screen/Admin/MasterBanner/FormBanner';
import MetodePembayaran from '../Screen/Admin/MetodePembayaran';
import FormMetodePembayaran from '../Screen/Admin/MetodePembayaran/FormMetodePembayaran';
import DetailLapangan from '../Screen/DetailLapangan';
import KonfirmasiPembayaran from '../Screen/KonfirmasiPembayaran';
import {scaleFont} from '../utils/helper';
import HistoryDetail from '../Screen/HistoryDetail';
import RejectPayment from '../Screen/RejectPayment';
import JadwalPertandingan from '../Screen/Admin/JadwalPertandingan';
import FormJadwalPertandingan from '../Screen/Admin/JadwalPertandingan/FormJadwalPertandingan';
import Notification from '../Screen/Notifikasi';
import NotificationDetail from '../Screen/NotificationDetail';
import ForgotPassword from '../Screen/Auth/ForgotPassword';

const Stack = createNativeStackNavigator();

const Routes = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator defaultScreenOptions={'Login'}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator defaultScreenOptions={'Home'}>
        <Stack.Screen
          name="Home"
          component={BottomTabs}
          options={{
            headerShown: false,
          }}
        />

        {/* banner */}
        <Stack.Screen
          name="Banner"
          component={MasterBanner}
          options={({navigation}) => {
            return {
              headerTitle: 'Master Banner',
              headerRight: () => (
                <AntDesign
                  name="plus"
                  color={'#000'}
                  size={scaleFont(16)}
                  onPress={() => navigation.navigate('BannerForm')}
                />
              ),
            };
          }}
        />
        <Stack.Screen
          name="BannerForm"
          component={MasterBannerForm}
          options={({navigation}) => {
            return {
              headerTitle: 'Form Banner',
            };
          }}
        />

        {/* lapangan */}
        <Stack.Screen
          name="DataLapangan"
          component={DataLapangan}
          options={({navigation}) => {
            return {
              headerTitle: 'Data Lapangan',
              headerRight: () => (
                <AntDesign
                  name="plus"
                  color={'#000'}
                  size={scaleFont(16)}
                  onPress={() => navigation.navigate('FormLapangan')}
                />
              ),
            };
          }}
        />
        <Stack.Screen
          name="FormLapangan"
          component={FormLapangan}
          options={({navigation}) => {
            return {
              headerTitle: 'Form Lapangan',
            };
          }}
        />

        {/* jadwal lapangan */}
        <Stack.Screen
          name="JadwalLapangan"
          component={JadwalLapangan}
          options={({navigation}) => {
            return {
              headerTitle: 'Data Jadwal Lapangan',
              headerRight: () => (
                <AntDesign
                  name="plus"
                  color={'#000'}
                  size={scaleFont(16)}
                  onPress={() => navigation.navigate('FormJadwalLapangan')}
                />
              ),
            };
          }}
        />
        <Stack.Screen
          name="FormJadwalLapangan"
          component={FormJadwalLapangan}
          options={({navigation}) => {
            return {
              headerTitle: 'Form Jadwal Lapangan',
            };
          }}
        />

        {/* jadwal lapangan */}
        <Stack.Screen
          name="MetodePembayaran"
          component={MetodePembayaran}
          options={({navigation}) => {
            return {
              headerTitle: 'Data Metode Pembayaran',
              headerRight: () => (
                <AntDesign
                  name="plus"
                  color={'#000'}
                  size={scaleFont(16)}
                  onPress={() => navigation.navigate('FormMetodePembayaran')}
                />
              ),
            };
          }}
        />
        <Stack.Screen
          name="FormMetodePembayaran"
          component={FormMetodePembayaran}
          options={({navigation}) => {
            return {
              headerTitle: 'Form petode pembayaran',
            };
          }}
        />

        {/* detail lapangan */}
        <Stack.Screen
          name="DetailLapangan"
          component={DetailLapangan}
          options={({navigation, route}) => {
            return {
              headerTitle: 'Detail Lapangan',
            };
          }}
        />
        {/* Konfirmasi Pembayaran */}
        <Stack.Screen
          name="KonfirmasiPembayaran"
          component={KonfirmasiPembayaran}
          options={({navigation, route}) => {
            return {
              headerTitle: 'Konfirmasi Pembayaran',
            };
          }}
        />
        {/* Detail Pemesanan */}
        <Stack.Screen
          name="HistoryDetail"
          component={HistoryDetail}
          options={({navigation, route}) => {
            return {
              headerTitle: 'Detail Pemesanan',
            };
          }}
        />

        {/* Reject Payment */}
        <Stack.Screen
          name="RejectPayment"
          component={RejectPayment}
          options={({navigation, route}) => {
            return {
              headerTitle: 'Tolak Pembayaran',
            };
          }}
        />

        {/* jadwal pertandingan */}
        <Stack.Screen
          name="JadwalPertandingan"
          component={JadwalPertandingan}
          options={({navigation}) => {
            return {
              headerTitle: 'Data Jadwal Pertandingan',
              headerRight: () => (
                <AntDesign
                  name="plus"
                  color={'#000'}
                  size={scaleFont(16)}
                  onPress={() => navigation.navigate('FormJadwalPertandingan')}
                />
              ),
            };
          }}
        />
        <Stack.Screen
          name="FormJadwalPertandingan"
          component={FormJadwalPertandingan}
          options={({navigation}) => {
            return {
              headerTitle: 'Form Jadwal Pertandingan',
            };
          }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={({navigation}) => {
            return {
              headerTitle: 'Notifikasi',
            };
          }}
        />
        <Stack.Screen
          name="NotificationDetail"
          component={NotificationDetail}
          options={({navigation, route}) => {
            return {
              headerTitle: route?.params?.title || 'Notifikasi Detail',
            };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
