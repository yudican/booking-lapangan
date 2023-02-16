import database from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {Button, Dialog, Menu, Paragraph, Portal} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import OnPress from '../../../Components/OnPress';
import {
  mapObject,
  scaleFont,
  scaleHeight,
  scaleWidth,
} from '../../../utils/helper';

const MetodePembayaran = ({navigation}) => {
  const [metodePembayaran, setMetodePembayaran] = useState([]);

  useEffect(() => {
    database()
      .ref('/metode-pembayaran')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setMetodePembayaran(mapObject(data));
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
        {metodePembayaran.map((item, index) => (
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
      .ref('/metode-pembayaran/' + item.id)
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
      <Image source={{uri: item.logo}} style={style.imageItem} />
      <View style={{marginLeft: scaleWidth(3)}}>
        <Text style={style.titleItem}>{item.nama_bank}</Text>
        <Text style={style.titleItem}>
          {item.nama_rekening} - {item.nomor_rekening}
        </Text>
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
              navigation.navigate('BannerForm', item);
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
    width: scaleWidth(66),
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

export default MetodePembayaran;
