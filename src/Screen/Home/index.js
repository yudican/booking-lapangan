import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {
  mapObject,
  scaleFont,
  scaleHeight,
  scaleWidth,
} from '../../utils/helper';
import database from '@react-native-firebase/database';
import OnPress from '../../Components/OnPress';
import LapanganJadwal from '../../Routes/TopTabs/Home/LapanganJadwal';
const Home = ({navigation}) => {
  const [banners, setBanners] = useState([]);
  const [lapangan, setLapangan] = useState([]);

  useEffect(() => {
    database()
      .ref('/banner')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setBanners(mapObject(data));
        }
      });

    database()
      .ref('/lapangan')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setLapangan(mapObject(data));
        }
      });
  }, []);

  return (
    <View
      style={{flex: 1, backgroundColor: '#fff'}}
      showsVerticalScrollIndicator={false}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: scaleHeight(2),
          borderRadius: scaleHeight(1.5),
        }}>
        <Carousel
          loop
          width={scaleWidth(95)}
          height={scaleWidth(90) / 2}
          // autoPlay={true}
          data={banners}
          scrollAnimationDuration={1000}
          pagingEnabled={true}
          onSnapToItem={index => console.log('current index:', index)}
          renderItem={({index, item}) => (
            <View
              key={index}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: scaleHeight(0.1),
              }}>
              <Image
                style={{
                  width: scaleWidth(92),
                  height: scaleHeight(22),
                  borderRadius: scaleHeight(1.5),
                }}
                source={{uri: item.image}}
              />
            </View>
          )}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#0652DD',
          marginTop: scaleHeight(2),
        }}>
        <LapanganJadwal data={lapangan} />
      </View>
    </View>
  );
};

const ItemLapangan = ({item, onPress}) => {
  return (
    <OnPress onPress={onPress}>
      <View
        style={{
          justifyContent: 'center',
          marginTop: scaleHeight(3),
          paddingHorizontal: scaleWidth(3),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            borderWidth: 1,
            borderColor: '#eaeaea',
            padding: scaleWidth(2),
            borderRadius: scaleHeight(1),
          }}>
          <Image
            source={{uri: item.image}}
            style={{
              backgroundColor: '#0652DD',
              height: scaleHeight(6),
              width: scaleWidth(15),
              borderRadius: scaleHeight(1),
            }}
          />

          <View style={{marginLeft: scaleWidth(3)}}>
            <Text
              style={{
                color: '#000',
                fontSize: scaleFont(16),
                fontWeight: 'bold',
                width: scaleWidth(70),
              }}>
              {item.nama}
            </Text>
            <Text
              style={{
                color: '#0652DD',
                fontSize: scaleFont(14),
                fontWeight: 'bold',
              }}>
              Rp. {item.harga}
            </Text>
          </View>
        </View>
      </View>
    </OnPress>
  );
};

export default Home;
