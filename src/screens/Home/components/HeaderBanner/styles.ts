import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '@theme/GlobalStyles';

export const Container = styled.View`
  width: 100%;
  position: relative;
`;

export const BannerImage = styled(Image)<{ $aspectRatio: number }>`
  width: 100%;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
`;

const styles = StyleSheet.create({
  actionButtonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
});

export const ActionsRow = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

export const ActionButton = styled.TouchableOpacity.attrs({
  style: styles.actionButtonShadow,
})`
  background-color: ${theme.colors.yellow};
  padding: 8px 22px;
  border-radius: 14px;
  margin: 0 10px;
`;

export const ActionButtonText = styled.Text`
  color: ${theme.colors['clear-white']};
  font-size: 18px;
  font-family: 'MontserratMedium';
`;
