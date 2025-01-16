import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
//Home Back Button
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useAuth } from '@/lib';

import { performOCR } from '../../lib/services/ocr';
import { uploadToS3, uploadToS3MainJson } from '../../lib/services/s3-bucket'; // Yeni eklenen dosyayı import ediyoruz
import { summarizeText } from '../../lib/services/summarize';
import CameraView from './camera-view';
import ImagePreview from './image-preview';

const LoadingView = () => (
  <SafeAreaView className="flex-1 items-center justify-center">
    <ActivityIndicator size="large" color="#0000ff" />
    <Text className="mt-5 text-center text-base text-gray-800">
      Processing...
    </Text>
  </SafeAreaView>
);

const SummaryView = ({
  summary,
  onReset,
}: {
  summary: string;
  onReset: () => void;
}) => (
  <SafeAreaView className="flex-1 items-center justify-center p-5">
    <Text className="p-5 text-center text-base text-gray-800">{summary}</Text>
    <TouchableOpacity
      className="mt-5 flex-row items-center rounded-full bg-black/60 px-8 py-3"
      onPress={onReset}
    >
      <MaterialIcons name="camera" size={24} color="white" />
      <Text className="ml-2 text-base font-bold text-white">
        Take Another Photo
      </Text>
    </TouchableOpacity>
    <HomeBackButton />
  </SafeAreaView>
);

const MainScreen = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const getToken = useAuth.use.token();

  const handleProcessImage = async () => {
    if (!capturedImage || !getToken?.email) return;

    setLoading(true);

    try {
      // Resmi S3'e yükle
      const imageFileName = `${Date.now()}.jpg`;
      const imageS3Url = await uploadToS3({
        data: capturedImage,
        email: getToken.email,
        fileName: imageFileName,
      });

      // OCR ve özet işlemleri
      const ocrText = await performOCR(imageS3Url);
      const summaryText = await summarizeText(ocrText);

      // Yeni görüntü verilerini main.json'a ekle
      await uploadToS3MainJson({
        email: getToken.email,
        newImageData: {
          imageUrl: imageS3Url,
          imageName: imageFileName,
          ocrText: ocrText,
          summary: summaryText,
          timestamp: new Date().toISOString(),
        },
      });

      setSummary(summaryText);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setSummary(null);
  };

  if (loading) return <LoadingView />;
  if (summary) return <SummaryView summary={summary} onReset={handleReset} />;
  if (capturedImage) {
    return (
      <ImagePreview
        imageUri={capturedImage}
        onProcess={handleProcessImage}
        onRetake={handleReset}
      />
    );
  }
  return <CameraView onCapture={setCapturedImage} />;
};

export default MainScreen;

export const HomeBackButton = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.push('/');
  };

  return (
    <TouchableOpacity
      onPress={handleBackPress}
      className="mt-5 flex-row items-center rounded-full bg-black/60 px-8 py-3"
    >
      <MaterialIcons name="undo" size={24} color="white" />
      <Text className="ml-2 text-base font-bold text-white">Back to Home</Text>
    </TouchableOpacity>
  );
};
