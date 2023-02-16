import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const IS_DARK_MODE = useTheme() === 'dark';
const BACKGROUND_COLOR = IS_DARK_MODE ? Colors.darker : Colors.lighter;
const DEFAULT_COLOR = IS_DARK_MODE ? Colors.white : Colors.black;

export {IS_DARK_MODE, BACKGROUND_COLOR, DEFAULT_COLOR};
