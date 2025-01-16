import { MaterialIcons } from '@expo/vector-icons';
import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router'; // useRouter kullanımı
import { useRef, useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';

export default function CameraComp({
  onCapture,
}: {
  onCapture: (uri: string) => void;
}) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter(); // Router hook'unu alıyoruz

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="pb-2 text-center">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center">
      <CameraView className="flex-1" facing={facing} ref={cameraRef}>
        <View className="absolute bottom-5 w-full flex-row items-center justify-center px-5">
          <IconButton name="close" onPress={() => router.back()} />
          <IconButton
            name="camera-alt"
            onPress={() => takePicture(cameraRef, onCapture)}
          />
          <IconButton
            name="flip-camera-ios"
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          />
        </View>
      </CameraView>
    </View>
  );
}

type IconName = keyof typeof MaterialIcons.glyphMap; // MaterialIcons'dan geçerli ikon adlarını alır

const IconButton = ({
  name,
  onPress,
}: {
  name: IconName; //  Sadece geçerli ikon adlarını kabul ediyor
  onPress: () => void;
}) => (
  <TouchableOpacity
    className="mx-2 items-center justify-center rounded-full bg-black bg-opacity-50 p-3"
    onPress={onPress}
  >
    <MaterialIcons name={name} size={28} color="white" />
  </TouchableOpacity>
);

const takePicture = async (
  cameraRef: React.RefObject<CameraView>,
  onCapture: (uri: string) => void
) => {
  try {
    const { uri } = (await cameraRef.current?.takePictureAsync()) || {};
    uri && onCapture(uri);
  } catch (error) {
    console.error('Error capturing image:', error);
  }
};
