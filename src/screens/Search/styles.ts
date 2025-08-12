import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Wrapper = styled.SafeAreaView`
  background-color: ${(props) => props.theme.colors['clear-white']};
  flex: 1;
`;

export const Container = styled.View`
  padding: 0px 10px;
  background-color: ${(props) => props.theme.colors['clear-white']};
  align-items: center;
  width: 100%;
  height: ${Platform.OS === 'android' ? '70%' : '80%'};
`;

export const HeaderButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 5px;
  margin: 10px 0;
  width: 100%;
  height: 40px;
`;

export const HeaderButton = styled.TouchableOpacity`
  width: 45%;
`;

export const HeaderButtonLine = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${(props) => props.theme.colors['brand-blue']};
`;

export const LoaderContainer = styled.View`
  width: 100%;
  margin-top: 90%;
  align-items: center;
  justify-content: center;
`;
