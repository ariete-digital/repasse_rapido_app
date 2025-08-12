import SwiperFlatList from 'react-native-swiper-flatlist';
import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 100, // Aumentar padding para dar espaço aos botões flutuantes
  },
}))`
  flex: 1;
  background-color: white;
`;

export const SwiperContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors['white']};
  position: relative;
`;

export const ExpandButton = styled.Pressable`
  position: absolute;
  bottom: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

export const ItemsContainer = styled.View`
  padding: 0px 10px;
`;

export const LoadingContainer = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const FloatingButtonsContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  padding: 12px;
  background-color: white;
  gap: 12px;
`;

export const FloatingButton = styled.Pressable<{ backgroundColor: string }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  background-color: ${props => props.backgroundColor};
  gap: 8px;
`;
