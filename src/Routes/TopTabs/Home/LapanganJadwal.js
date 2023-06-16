import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import JadwalScreen from './JadwalScreen';

const Tab = createMaterialTopTabNavigator();
const LapanganJadwal = ({data}) => {
  if (data.length > 0) {
    return (
      <Tab.Navigator>
        {data.map((item, index) => (
          <Tab.Screen
            key={item.id}
            name={`${item.nama.replace(' ', '_')}_${index}`}
            options={{tabBarLabel: item.nama}}
            component={JadwalScreen}
            initialParams={{lapanganId: item.id, image: item.image}}
          />
        ))}
      </Tab.Navigator>
    );
  }

  return null;
};

export default LapanganJadwal;
