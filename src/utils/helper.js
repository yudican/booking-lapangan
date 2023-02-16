import {PixelRatio, ToastAndroid} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const scaleFont = (fontSize = 12) => {
  return PixelRatio.getFontScale() * fontSize;
};

export const scaleHeight = (height = 0) => {
  return hp(`${height}%`);
};

export const scaleWidth = (width = 0) => {
  return wp(`${width}%`);
};

export const mapObject = (object = {}, nested = false) => {
  let temp = [];
  Object.entries(object).forEach(entry => {
    const [key, value] = entry;
    temp.push({...value, id: key});
  });

  return temp;
};

export const mapObjectNested = (object = {}) => {
  let data = [];
  Object.entries(object).forEach(entry => {
    const [value] = entry;
    data.push(value);
  });

  return data;
};

// format date
export const formatDate = (date = new Date()) => {
  if (date) {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return date.toLocaleDateString('id-ID', options);
  }

  return '';
};

// format time
export const formatTime = (date = new Date()) => {
  if (date) {
    const options = {hour: 'numeric', minute: 'numeric'};
    return date.toLocaleTimeString('id-ID', options);
  }

  return '';
};

export const formatCurrency = (number = 0) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(number);
};

export const showAlert = message => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};
