import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AlertComponent from '@/components/ui/alert-component';
import {
  Search as SearchIcon,
  Trash as TrashIcon,
} from '@/components/ui/icons';
import { useAuth } from '@/lib';

import {
  deleteFromS3,
  getJsonFromS3,
  getS3Images,
} from '../../lib/services/s3-bucket';

// Tek Resim Bileşeni
interface ImageItemProps {
  item: {
    id: number;
    image: string;
    text: string;
    key: string;
    ocrText?: string;
    summaryText?: string;
  };
  onDelete: (key: string) => void;
  onView: (item: ImageItem) => void;
}

const ImageItem: React.FC<ImageItemProps> = ({ item, onDelete, onView }) => (
  <View className="mb-3 flex-row items-center rounded-md bg-white p-3 shadow-sm">
    <Image source={{ uri: item.image }} className="mr-4 size-12 rounded-md" />
    <Text className="flex-1 truncate text-sm text-gray-800" numberOfLines={1}>
      {item.text}
    </Text>
    <TouchableOpacity onPress={() => onView(item)} className="mr-3">
      <SearchIcon color="#007AFF" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onDelete(item.key)}>
      <TrashIcon color="#FF0000" />
    </TouchableOpacity>
  </View>
);

interface ImageItem {
  id: number;
  image: string;
  text: string;
  key: string;
  ocrText?: string;
  summaryText?: string;
}

const ImageDetailsView = ({ image }: { image: ImageItem }) => (
  <View className="items-center">
    <Text className="mb-2 text-lg font-bold">{image.text}</Text>
    <Image source={{ uri: image.image }} className="mb-4 size-40 rounded-md" />
    <Text className="mb-2 text-sm">Summary:</Text>
    <Text className="mb-4 text-xs">
      {image.summaryText || 'No summary available'}
    </Text>
    <Text className="mb-2 text-sm">OCR Text:</Text>
    <Text className="text-xs">{image.ocrText || 'No OCR text available'}</Text>
  </View>
);

const AlertMessage = ({
  type,
  selectedImage,
}: {
  type: string;
  selectedImage: ImageItem | null;
}) =>
  type === 'view' ? (
    <ImageDetailsView image={selectedImage!} />
  ) : (
    'You are about to delete this picture.'
  );

interface S3JsonImage {
  imageName: string;
  ocrText: string;
  summary: string;
}

interface ImageOperationsProps {
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  alert: { visible: boolean; key: string; type: string };
  setAlert: React.Dispatch<
    React.SetStateAction<{ visible: boolean; key: string; type: string }>
  >;
  setSelectedImage: React.Dispatch<React.SetStateAction<ImageItem | null>>;
}

const useImageOperations = ({
  setImages,
  alert,
  setAlert,
  setSelectedImage,
}: ImageOperationsProps) => {
  const handleDelete = (key: string) =>
    setAlert({ visible: true, key, type: 'delete' });

  const handleView = (item: ImageItem) => {
    setSelectedImage(item);
    setAlert({ visible: true, key: item.key, type: 'view' });
  };

  const confirmDelete = async () => {
    try {
      await deleteFromS3(alert.key);
      setImages((prev) => prev.filter((img) => img.key !== alert.key));
    } catch {
      Alert.alert('Hata', 'Resim silinemedi.');
    } finally {
      setAlert({ visible: false, key: '', type: '' });
    }
  };

  const closeAlert = () => setAlert({ visible: false, key: '', type: '' });

  return { handleDelete, handleView, confirmDelete, closeAlert };
};

const transformS3Data = (
  data: { id: number; image: string; text?: string; key?: string }[],
  jsonData: { images: S3JsonImage[] }
) =>
  data.map(({ id, image, text = '', key = `${id}` }) => {
    const jsonItem = jsonData.images.find(
      (img: S3JsonImage) => img.imageName === text
    );
    return {
      id,
      image,
      text,
      key,
      ocrText: jsonItem?.ocrText,
      summaryText: jsonItem?.summary,
    };
  });

const useFetchS3Images = (
  getToken: { email?: string },
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>
) => {
  return useCallback(async () => {
    try {
      if (!getToken?.email) return;
      const data = await getS3Images(getToken.email);
      const jsonData = await getJsonFromS3(getToken.email);
      setImages(transformS3Data(data, jsonData));
    } catch (err) {
      console.error('Error fetching images from S3:', err);
    }
  }, [getToken?.email, setImages]);
};

const useScanItems = (getToken: { email?: string }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [alert, setAlert] = useState({ visible: false, key: '', type: '' });
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const { handleDelete, handleView, confirmDelete, closeAlert } =
    useImageOperations({
      setImages,
      alert,
      setAlert,
      setSelectedImage,
    });

  const fetchS3Images = useFetchS3Images(getToken, setImages);

  return {
    images,
    alert,
    selectedImage,
    handleDelete,
    handleView,
    confirmDelete,
    closeAlert,
    fetchS3Images,
  };
};

const ScanItems = () => {
  const getToken = useAuth.use.token();
  const {
    images,
    alert,
    selectedImage,
    handleDelete,
    handleView,
    confirmDelete,
    closeAlert,
    fetchS3Images,
  } = useScanItems(getToken ?? { email: undefined });

  useFocusEffect(
    useCallback(() => {
      fetchS3Images();
    }, [fetchS3Images])
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
      {images.map((item) => (
        <ImageItem
          key={item.id}
          item={item}
          onDelete={handleDelete}
          onView={handleView}
        />
      ))}

      <AlertComponent
        visible={alert.visible}
        title={alert.type === 'view' ? 'Image Details' : 'Are you sure?'}
        message={
          <AlertMessage type={alert.type} selectedImage={selectedImage} />
        }
        onConfirm={alert.type === 'view' ? closeAlert : confirmDelete}
        onCancel={closeAlert}
        showActions={true}
      />
    </ScrollView>
  );
};

export default ScanItems;
