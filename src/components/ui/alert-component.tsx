import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface AlertComponentProps {
  visible: boolean;
  title: string;
  message: string | JSX.Element;
  onConfirm?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

const AlertButton = ({
  onPress,
  color,
  icon,
  label,
}: {
  onPress?: () => void;
  color: string;
  icon: 'cancel' | 'check-circle';
  label: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center justify-center rounded-md px-6 py-2`}
    style={{ backgroundColor: color }}
  >
    <MaterialIcons name={icon} size={24} color="white" className="mr-2" />
    <Text className="font-medium text-white">{label}</Text>
  </TouchableOpacity>
);

const AlertContent = ({
  title,
  message,
  showActions,
  onConfirm,
  onCancel,
}: Omit<AlertComponentProps, 'visible'>) => (
  <View className="max-h-[75%] w-11/12 max-w-md rounded-lg bg-white shadow-lg">
    <View className="p-6">
      <Text className="mb-4 text-xl font-semibold text-gray-800">{title}</Text>
    </View>

    <ScrollView
      className="px-6"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={true}
    >
      {typeof message === 'string' ? (
        <Text className="mb-6 text-gray-600">{message}</Text>
      ) : (
        message
      )}
    </ScrollView>

    {showActions && (
      <View className="mt-4 flex-row justify-around border-t border-gray-200 p-6">
        <AlertButton
          onPress={onCancel}
          color="#FF0000"
          icon="cancel"
          label="No"
        />
        <AlertButton
          onPress={onConfirm}
          color="#007AFF"
          icon="check-circle"
          label="Yes"
        />
      </View>
    )}
  </View>
);

const useNativeAlert = (props: AlertComponentProps) => {
  const { visible, title, message, onConfirm, onCancel, showActions } = props;

  useEffect(() => {
    if (Platform.OS === 'web' || !visible || !showActions) return;

    Alert.alert(
      title,
      typeof message === 'string' ? message : 'Are you sure?',
      [
        { text: 'No', onPress: onCancel, style: 'cancel' },
        { text: 'Yes', onPress: onConfirm },
      ],
      { cancelable: false }
    );
  }, [visible, title, message, onConfirm, onCancel, showActions]);
};

const AlertComponent: React.FC<AlertComponentProps> = (props) => {
  useNativeAlert(props);

  if (Platform.OS === 'web') {
    return (
      <Modal visible={props.visible} transparent={true} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <AlertContent {...props} />
        </View>
      </Modal>
    );
  }

  return null;
};

export default AlertComponent;
