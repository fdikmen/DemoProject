import React from 'react';
import { View } from 'react-native';

import { Scan } from '@/components/camera/scan';
import ScanItems from '@/components/camera/scan-items';
import { FocusAwareStatusBar } from '@/components/ui';

export default function Home() {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <FocusAwareStatusBar />

      <Scan />
      <ScanItems />
    </View>
  );
}
