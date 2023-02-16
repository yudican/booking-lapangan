import database from '@react-native-firebase/database';
import React, {useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Snackbar, TextInput} from 'react-native-paper';
import Button from '../../../Components/Botton/Button';
import {
  formatDate,
  mapObject,
  scaleHeight,
  scaleWidth,
} from '../../../utils/helper';
import uuid from 'react-native-uuid';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '../../../Components/DateTimePicker/DateTimePicker';

const FormJadwalPertandingan = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    tanggal_pertandingan: null,
    nama_tim_1: null,
    nama_tim_2: null,
  });

  const [open, setOpen] = useState(false);
  const [openJadwal, setOpenJadwal] = useState(false);
  const [zIndex, setZIndex] = useState({
    lapangan: 0,
    jadwal: 0,
  });

  const [lapangan, setLapangan] = useState([]);
  const [jadwal, setJadwal] = useState([]);

  const [lapanganSelected, setLapanganSelected] = useState(null);
  const [jadwalSelected, setJadwalSelected] = useState(null);

  const onSubmit = () => {
    setLoading(true);
    if (!jadwalSelected) {
      setVisible(true);
      setLoading(false);
      return setMessage('Tanggal Pertandingan Tidak Boleh Kosong');
    } else if (!lapanganSelected) {
      setVisible(true);
      setLoading(false);
      return setMessage('Tanggal Pertandingan Tidak Boleh Kosong');
    } else if (!form.nama_tim_1 || form.nama_tim_1?.length < 3) {
      setVisible(true);
      setLoading(false);
      return setMessage('Nama Tim 1 Tidak Boleh Kosong');
    } else if (!form.nama_tim_2 || form.nama_tim_2?.length < 3) {
      setVisible(true);
      setLoading(false);
      return setMessage('Nama Tim 2 Tidak Boleh Kosong');
    } else if (!form.tanggal_pertandingan) {
      setVisible(true);
      setLoading(false);
      return setMessage('Tanggal Pertandingan Tidak Boleh Kosong');
    }

    const lapangan_id = route?.params?.lapangan?.value || lapanganSelected;
    const uid = route?.params?.id || uuid.v4();
    const urlPath = `/lapangan/${lapangan_id}/jadwal/${uid}`;

    const lapanganItem = lapangan.find(item => item.value === lapanganSelected);
    const lapanganData = {
      id: lapanganSelected,
      nama: lapanganItem.label,
    };

    const jadwalItem = jadwal.find(item => item.value === jadwalSelected);
    const jadwalData = {
      id: jadwalSelected,
      waktu: jadwalItem.label,
    };

    database()
      .ref(urlPath)
      .set({
        ...form,
        id: uid,
        lapangan: lapanganData,
        jadwal: jadwalData,
      })
      .then(() => {
        setVisible(true);
        setLoading(false);
        setMessage('Data berhasil disimpan');
        return navigation.replace('JadwalPertandingan');
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
      setLapanganSelected(route?.params?.lapangan?.id);
      setJadwalSelected(route?.params?.jadwal?.id);
    }
  }, [route]);

  useEffect(() => {
    database()
      .ref('/lapangan')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setLapangan(
            mapObject(data).map(item => ({label: item.nama, value: item.id})),
          );
        }
      });

    database()
      .ref('/jadwal')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setJadwal(
            mapObject(data).map(item => ({
              label: `${item.jam_mulai} - ${item.jam_selesai}`,
              value: item.id,
            })),
          );
        }
      });
  }, []);

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
        <View style={{paddingBottom: scaleHeight(2)}}>
          <Text style={{color: '#000', paddingBottom: scaleHeight(1)}}>
            Pilih Lapangan
          </Text>
          <DropDownPicker
            open={open}
            value={lapanganSelected}
            items={lapangan}
            setOpen={e => {
              setOpen(e);
              setZIndex(zIndex => ({...zIndex, lapangan: e ? 1000 : 0}));
            }}
            setValue={setLapanganSelected}
            label={'Nama Lapangan'}
            zIndex={zIndex.lapangan}
          />
        </View>
        <View style={{paddingBottom: scaleHeight(2)}}>
          <Text style={{color: '#000', paddingBottom: scaleHeight(1)}}>
            Pilih Jadwal
          </Text>
          <DropDownPicker
            open={openJadwal}
            value={jadwalSelected}
            setValue={setJadwalSelected}
            items={jadwal}
            setOpen={e => {
              setOpenJadwal(e);
              setZIndex(zIndex => ({...zIndex, jadwal: e ? 1000 : 0}));
            }}
            label={'Nama Jadwal'}
            zIndex={zIndex.jadwal}
          />
        </View>
        <DateTimePicker
          label={'Tanggal'}
          placeholder={'Tanggal'}
          mode={'date'}
          value={
            form.tanggal_pertandingan
              ? formatDate(new Date(form.tanggal_pertandingan))
              : null
          }
          onChange={date => {
            setForm(formData => ({
              ...formData,
              tanggal_pertandingan: new Date(date).getTime(),
            }));
          }}
        />

        <TextInput
          label={'Nama Tim 1'}
          mode={'outlined'}
          value={form.nama_tim_1}
          style={{marginBottom: scaleHeight(2), borderColor: '#ddd'}}
          onChangeText={value =>
            setForm(curForm => ({...curForm, nama_tim_1: value}))
          }
        />

        <TextInput
          label={'Nama Tim 2'}
          mode={'outlined'}
          value={form.nama_tim_2}
          style={{marginBottom: scaleHeight(2), borderColor: '#ddd'}}
          onChangeText={value =>
            setForm(curForm => ({...curForm, nama_tim_2: value}))
          }
        />
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

export default FormJadwalPertandingan;
