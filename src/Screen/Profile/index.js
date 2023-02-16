import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import database from '@react-native-firebase/database';
import {List} from 'react-native-paper';
import {
  scaleFont,
  scaleHeight,
  scaleWidth,
  showAlert,
} from '../../utils/helper';
import auth from '@react-native-firebase/auth';
import Button from '../../Components/Botton/Button';

const Profile = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const signOut = () => {
    setLoading(true);
    auth()
      .signOut()
      .then(() => {
        setLoading(false);
        showAlert('Berhasil Keluar');
      });
  };

  const getUser = () => {
    const {uid} = auth().currentUser;
    database()
      .ref('/user/' + uid)
      .on('value', snapshot => {
        const data = snapshot.val();
        setUser(data);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f5f6fa',
      }}>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: scaleWidth(3),
            paddingVertical: scaleHeight(2),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <View
              style={{
                width: scaleWidth(10),
                height: scaleWidth(10),
                backgroundColor: '#0652DD',
                borderRadius: scaleWidth(10) / 2,
              }}
            />
            <View style={{marginLeft: scaleWidth(3)}}>
              <Text style={{fontSize: scaleFont(13), color: '#000'}}>
                {user?.nama}
              </Text>
              <Text style={{color: '#000'}}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* menu admin */}
        {user?.role === 'admin' && (
          <View style={{marginTop: scaleHeight(1)}}>
            <List.Item
              style={{backgroundColor: '#fff', marginTop: scaleHeight(0.1)}}
              title="Banner"
              left={props => <List.Icon {...props} icon="folder" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('Banner')}
              titleStyle={{color: '#000'}}
            />

            <List.Item
              style={{backgroundColor: '#fff', marginTop: scaleHeight(0.1)}}
              title="Lapangan"
              left={props => <List.Icon {...props} icon="folder" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('DataLapangan')}
              titleStyle={{color: '#000'}}
            />

            <List.Item
              style={{backgroundColor: '#fff', marginTop: scaleHeight(0.1)}}
              title="Jadwal Lapangan"
              left={props => <List.Icon {...props} icon="folder" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('JadwalLapangan')}
              titleStyle={{color: '#000'}}
            />
            <List.Item
              style={{backgroundColor: '#fff', marginTop: scaleHeight(0.1)}}
              title="Jadwal Pertandingan"
              left={props => <List.Icon {...props} icon="folder" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('JadwalPertandingan')}
              titleStyle={{color: '#000'}}
            />
            <List.Item
              style={{backgroundColor: '#fff', marginTop: scaleHeight(0.1)}}
              title="Metode Pembayaran"
              left={props => <List.Icon {...props} icon="folder" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('MetodePembayaran')}
              titleStyle={{color: '#000'}}
            />

            <List.Item
              style={{backgroundColor: '#fff', marginTop: scaleHeight(0.1)}}
              title="Order"
              left={props => <List.Icon {...props} icon="folder" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('History')}
              titleStyle={{color: '#000'}}
            />
          </View>
        )}

        {/* menu user */}
        {user?.role === 'member' && (
          <View style={{marginTop: scaleHeight(1)}}>
            <List.Item
              style={{backgroundColor: '#fff', marginTop: scaleHeight(0.1)}}
              title="Order"
              left={props => <List.Icon {...props} icon="folder" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('History')}
              titleStyle={{color: '#000'}}
            />
            <List.Item
              style={{backgroundColor: '#fff', marginTop: scaleHeight(0.1)}}
              title="Notifikasi"
              left={props => <List.Icon {...props} icon="folder" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('Notification')}
              titleStyle={{color: '#000'}}
            />
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Button title="Keluar" onPress={() => signOut()} loading={loading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: scaleWidth(3),
    paddingBottom: scaleHeight(1),
    backgroundColor: '#fff',
  },
});

export default Profile;
