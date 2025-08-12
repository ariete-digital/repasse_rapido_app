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
  align-items: center;
  padding: 0 10px;
`;

export const ButtonRow = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;
