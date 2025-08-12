import { ReactNode } from 'react';
import { ActivityIndicator } from 'react-native';

import Text from '@components/Text';
import * as B from './styles';

interface BaseFilterProps {
  visible: boolean
  isLoading: boolean
  title: string
  onCancel?: () => void
  onSubmit?: () => void
  render: () => ReactNode
}

const BaseFilterModal = ({ visible, title, render, onCancel, onSubmit, isLoading }: BaseFilterProps) => {
  return (
    <B.Container
      visible={visible}
      presentationStyle="overFullScreen"
      transparent
      animationType="fade"
    >
      <B.ModalContainer>
        <B.ModalContent>
          <B.ModalTitle>
            <Text color="black-700" fontStyle="p-14-bold">
              {title}
            </Text>
          </B.ModalTitle>
          <B.ModalBody>
            {isLoading ? <ActivityIndicator /> : render()}
          </B.ModalBody>
          <B.ModalFooter>
            {
              onSubmit && onCancel ?
                <>
                  <B.Pressable onPress={onCancel} activeOpacity={0.6}>
                    <Text color="orange-text" fontStyle="p-14-bold">
                      CANCELAR
                    </Text>
                  </B.Pressable>
                  <B.Pressable
                    onPress={onSubmit}
                    bgColor="brand-red"
                    activeOpacity={0.6}
                  >
                    <Text color="white" fontStyle="p-14-bold">
                      OK
                    </Text>
                  </B.Pressable>
                </> : null
            }

          </B.ModalFooter>
        </B.ModalContent>
      </B.ModalContainer>
    </B.Container>
  );
};

export default BaseFilterModal;
