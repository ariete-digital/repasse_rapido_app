import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #9A0B26;
  padding: 16px;
  max-height: 340px;
`;

export const Label = styled.Text`
  margin-top: 12px;
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;


export const SearchButton = styled.TouchableOpacity`
  background-color: #EBE8D9;
  padding: 8px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

export const SearchButtonText = styled.Text`
  color: #9A0B26;
  font-weight: bold;
  font-size: 14px;
`;

export const AnoContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const FilterContainer = styled.View`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
