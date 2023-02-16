import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import History from '../../Screen/History';
import Home from '../../Screen/Home';
import ListLapangan from '../../Screen/ListLapangan/ListLapangan';
import Profile from '../../Screen/Profile';
import {scaleFont} from '../../utils/helper';

const Tab = createBottomTabNavigator();
const BottomTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <AntDesign name="home" color={color} size={size} />
              <Text style={{fontSize: scaleFont(10), color}}>Home</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ListLapangan"
        component={ListLapangan}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Entypo name="grid" color={color} size={size} />
              <Text style={{fontSize: scaleFont(10), color}}>Field</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <AntDesign name="clockcircleo" color={color} size={size} />
              <Text style={{fontSize: scaleFont(10), color}}>Order</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <AntDesign name="user" color={color} size={size} />
              <Text style={{fontSize: scaleFont(10), color}}>Akun</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
