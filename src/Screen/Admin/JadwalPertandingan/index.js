import database from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {Button, Dialog, Menu, Paragraph, Portal} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import OnPress from '../../../Components/OnPress';
import {
  formatDate,
  mapObject,
  scaleFont,
  scaleHeight,
  scaleWidth,
} from '../../../utils/helper';

const JadwalPertandingan = ({navigation}) => {
  const [dataJadwalPertandingan, setDataJadwalPertandingan] = useState([]);

  useEffect(() => {
    database()
      .ref('/lapangan')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const tempData = mapObject(data) || [];
          const finalData = tempData.map(item => {
            const temp = mapObject(item.jadwal) || [];
            return temp;
          });

          const flattenData = finalData.flat();
          setDataJadwalPertandingan(flattenData);
        }
      });
  }, []);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#f5f6fa'}}
      showsVerticalScrollIndicator={false}>
      <View
        style={{
          justifyContent: 'center',
          marginTop: scaleHeight(3),
          paddingHorizontal: scaleWidth(3),
        }}>
        {dataJadwalPertandingan.map((item, index) => (
          <Item key={item.id} item={item} navigation={navigation} />
        ))}
      </View>
    </ScrollView>
  );
};

const Item = ({item, navigation}) => {
  const [visible, setVisible] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);

  const deleteData = () => {
    database()
      .ref(`/lapangan/${item.lapangan.id}/jadwal/${item.id}`)
      .remove()
      .then(() => {
        ToastAndroid.showWithGravityAndOffset(
          'Data berhasil dihapus',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      });
  };

  return (
    <View style={style.containerItem}>
      <View style={{flex: 1}}>
        <View style={style.containerItemHeading}>
          <Text style={[style.titleItem, {color: '#0652DD'}]}>
            {formatDate(new Date(item.tanggal_pertandingan))}{' '}
            {item.jadwal.waktu}
          </Text>
        </View>

        <View style={style.containerItemContent}>
          <Text style={style.titleItemContent}>{item.nama_tim_1}</Text>
          <Text style={style.titleItemContent}>{`VS`}</Text>
          <Text style={style.titleItemContent}>{item.nama_tim_2}</Text>
        </View>

        <View style={style.containerItemHeading}>
          <Text style={[style.titleItem, {color: 'green'}]}>
            {item.lapangan.nama}
          </Text>
        </View>
      </View>

      {/* menu */}
      <OnPress onPress={() => setVisible(true)} style={style.menuItem}>
        <Menu
          theme={{colors: {primary: '#fff'}}}
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={<Entypo name="dots-three-vertical" color={'#fff'} />}>
          <Menu.Item
            leadingIcon={'pencil'}
            onPress={() => {
              setVisible(false);
              navigation.navigate('FormJadwalPertandingan', item);
            }}
            title="Update"
          />
          <Menu.Item
            leadingIcon={'delete'}
            onPress={() => {
              setVisibleDialog(true);
              setVisible(false);
            }}
            title="Delete"
          />
        </Menu>
      </OnPress>

      {/* confirm popup */}
      <Portal>
        <Dialog
          visible={visibleDialog}
          onDismiss={() => setVisibleDialog(false)}>
          <Dialog.Title>Konfirmasi Hapus</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Yakin Hapus Data Ini?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => deleteData()}>Ya, Hapus</Button>
            <Button onPress={() => setVisibleDialog(false)}>Tidak</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const style = StyleSheet.create({
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#eaeaea',
    padding: scaleWidth(2),
    borderRadius: scaleHeight(1),
    backgroundColor: '#fff',
    marginBottom: scaleHeight(1),
  },
  containerItemHeading: {
    flex: 1,
    marginLeft: scaleWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#f5f6fa',
    borderBottomWidth: 1,
    paddingBottom: scaleHeight(0.5),
  },
  containerItemContent: {
    flex: 1,
    marginLeft: scaleWidth(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#f5f6fa',
    borderBottomWidth: 1,
    paddingVertical: scaleHeight(0.5),
  },
  imageItem: {
    backgroundColor: 'gray',
    height: scaleHeight(6),
    width: scaleWidth(15),
    borderRadius: scaleHeight(1),
  },
  titleItem: {
    color: '#000',
    fontSize: scaleFont(16),
    fontWeight: 'bold',
  },
  titleItemContent: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: scaleFont(18),
    textTransform: 'uppercase',
  },
  menuItem: {
    width: 17,
    height: 17,
    backgroundColor: '#00a8ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default JadwalPertandingan;
