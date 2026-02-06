import styled from 'styled-components/native';
import { Image } from 'expo-image';

export const Container = styled.SafeAreaView`
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: ${(props) => props.theme.colors['white']};
`;

export const ScrollingContent = styled.ScrollView.attrs({
    contentContainerStyle: {
      gap: 20,
    },
  })`
  width: 100%;
  background: ${(props) => props.theme.colors['clear-white']};
`;

export const RowContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 10px;
  padding: 0 10px;
  gap: 10px;
`;

export const ItemCardContainer = styled.View`
  width: 50%;
  padding: 2px 2px 2px 2px;
  border: 1px solid #EBE8D9;
  background-color: white;
`;

export const ItemCardImage = styled(Image)`
  height: 120px;
  width: 100%;
`;

export const ItemCardTitleContainer = styled.View`
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const TitleContainer = styled.View`
  width: 100%;
  margin-left: -10px;
`;
export const OffersContainer = styled.View`
  width: 100%;
  align-items: flex-start;
  padding: 0 10px;
`;

export const ButtonRow = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;

export const FilterCtaContainer = styled.View`
  width: 100%;
  padding: 0 10px;
`;

export const FilterCtaCard = styled.View`
  background-color: #9a0b26;
  border-radius: 12px;
  padding: 16px;
  gap: 12px;
`;

export const FilterCtaLabel = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const FilterCtaButton = styled.TouchableOpacity`
  background-color: #ebe8d9;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

export const FilterCtaButtonText = styled.Text`
  color: #9a0b26;
  font-weight: bold;
  font-size: 14px;
`;

export const ModalContainer = styled.View`
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  max-height: 90%;
`;

export const ModalHeader = styled.View`
  width: 100%;
  padding: 12px 16px;
  align-items: flex-end;
  background-color: #fff;
`;

export const ModalCloseButton = styled.TouchableOpacity`
  padding: 6px 8px;
`;

export const ModalCloseText = styled.Text`
  color: #9a0b26;
  font-weight: bold;
  font-size: 14px;
`;

export const ModalScroll = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
})``;
