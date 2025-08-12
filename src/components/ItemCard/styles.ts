import styled from 'styled-components/native'
import { Image } from 'expo-image';

export const ItemCardContainer = styled.View`
  width: 100%;
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

export const ButtonRow = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;