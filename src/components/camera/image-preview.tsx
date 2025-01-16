import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ImagePreviewProps {
  imageUri: string;
  onProcess: () => void;
  onRetake: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUri,
  onProcess,
  onRetake,
}) => {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Image
        source={{ uri: imageUri }}
        className="mb-5 min-h-[250px] w-full rounded-lg"
      />

      <View className="w-full flex-row justify-between">
        <TouchableOpacity
          onPress={onRetake}
          className="flex-row items-center rounded-full bg-black/50 px-5 py-2"
        >
          <MaterialIcons name="camera-alt" size={32} color="white" />
          <Text className="ml-2 text-sm font-bold text-white">Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onProcess}
          className="flex-row items-center rounded-full bg-black/50 px-5 py-2"
        >
          <MaterialIcons name="check-circle" size={32} color="white" />
          <Text className="ml-2 text-sm font-bold text-white">Process</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImagePreview;
