// components/ScanItem.tsx
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Trash as TrashIcon } from '@/components/ui/icons';

interface ScanItemProps {
  id: number;
  image: string;
  text: string;
  key: string;
  onDelete: (key: string) => void;
}

const ScanItem: React.FC<ScanItemProps> = ({ id, image, text, onDelete }) => {
  return (
    <View
      key={id}
      className="mb-3 flex-row items-center rounded-md bg-white p-3 shadow-sm"
    >
      {/* Sol Kısım - Resim */}
      <Image source={{ uri: image }} className="mr-4 size-12 rounded-md" />

      {/* Orta Kısım - Metin */}
      <Text
        className="flex-1 truncate text-sm text-gray-800"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {text}
      </Text>

      {/* Sağ Kısım - Silme İkonu */}
      <TouchableOpacity onPress={() => onDelete(id.toString())}>
        <TrashIcon color="#FF0000" />
      </TouchableOpacity>
    </View>
  );
};

export default ScanItem;
