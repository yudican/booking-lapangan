import React from 'react';

import {View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {TextInput} from 'react-native-paper';
import {scaleHeight} from '../../utils/helper';

const DateTimePicker = ({
  onChange,
  mode = 'date',
  value,
  label,
  placeholder,
}) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  return (
    <View>
      <TextInput
        label={label}
        mode={'outlined'}
        placeholder={placeholder}
        value={value}
        style={{marginBottom: scaleHeight(2), borderColor: '#ddd'}}
        onPressIn={() => setOpen(true)}
      />

      <DatePicker
        modal
        mode={mode}
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
          onChange(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default DateTimePicker;
