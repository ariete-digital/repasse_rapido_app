import styled from 'styled-components/native'
import { Image } from 'expo-image';

export const ItemCardContainer = styled.View`
  width: 100%;
  padding: 2px 2px 2px 2px;
  border: 1px solid #EBE8D9;
  background-color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ItemCardImage = styled(Image)`
  height: 120px;
  width: 100%;
`;

export const ItemCardTitleContainer = styled.View`
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  flex: 1;
`;

export const TitleBlock = styled.View<{ $reserveTwoLines: boolean }>`
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  margin-top: 6px;
  margin-bottom: 6px;
  ${({ $reserveTwoLines }) => $reserveTwoLines && 'height: 44px;'}
`;

export const DescriptionBlock = styled.View<{ $fixedLineHeight: boolean }>`
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  margin-top: 6px;
  margin-bottom: 6px;
  ${({ $fixedLineHeight }) => $fixedLineHeight && 'height: 16px;'}
`;

export const ButtonRow = styled.View`
  align-items: center;
  width: 100%;
  margin-top: auto;
  padding-top: 10px;
`;
