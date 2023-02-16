import React from 'react';
import OnPress from '../OnPress';
import ImagePicker from 'react-native-image-crop-picker';
import {Image, Text, View} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {scaleHeight, scaleWidth} from '../../utils/helper';

const ImagePickerForm = ({
  onCallback,
  path = null,
  url = null,
  cropping = true,
  width = scaleWidth(92),
  height = scaleHeight(22),
}) => {
  const showImagePicker = () => {
    if (url) {
      return ImagePicker.openCropper({
        path: url,
        width,
        height,
        includeBase64: true,
        cropping,
      }).then(image => {
        onCallback(image);
      });
    }

    ImagePicker.openPicker({
      width,
      height,
      cropping,
    }).then(image => {
      onCallback(image);
    });
  };

  const hasImage = path || url;
  const pathUri = path ? {uri: path} : {uri: url};
  return (
    <OnPress onPress={showImagePicker}>
      {hasImage ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: scaleHeight(0.1),
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: scaleWidth(1),
            borderStyle: 'dashed',
          }}>
          <Image style={{width, height}} source={pathUri} />
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: scaleHeight(3),
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: scaleWidth(1),
            borderStyle: 'dashed',
          }}>
          <EvilIcons name={'image'} size={scaleWidth(20)} />
          <Text>Upload Image</Text>
        </View>
      )}
    </OnPress>
  );
};

export default ImagePickerForm;
