import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const Scan = () => {
  const router = useRouter();

  const handleScanPress = () => {
    router.push('/camera'); // CameraScreen'e geçiş
  };

  return (
    <View className="mb-4 flex items-center">
      <TouchableOpacity
        className="flex flex-row items-center justify-center rounded-md bg-blue-600 px-6 py-2"
        onPress={handleScanPress}
      >
        <MaterialIcons
          name="camera-alt"
          size={24}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text className="text-lg font-bold text-white">Scan</Text>
      </TouchableOpacity>
    </View>
  );
};
