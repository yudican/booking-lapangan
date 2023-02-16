import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {scaleFont, scaleHeight} from '../../utils/helper';
import OnPress from '../OnPress';

const Button = ({
  onPress,
  title = 'Button Text',
  color = 'red',
  loading = false,
}) => {
  if (loading) {
    return (
      <View style={{...styles.container, backgroundColor: 'gray'}}>
        <Text style={styles.buttonTitle}>
          <ActivityIndicator color={'#fff'} />
        </Text>
      </View>
    );
  }
  return (
    <OnPress onPress={onPress}>
      <View style={[styles.container, {backgroundColor: color}]}>
        <Text style={styles.buttonTitle}>{title}</Text>
      </View>
    </OnPress>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    paddingVertical: scaleHeight(1.8),
    borderRadius: scaleHeight(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleHeight(2),
  },
  buttonTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scaleFont(14),
  },
});

export default Button;
