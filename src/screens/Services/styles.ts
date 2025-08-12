import { shadow } from '@utils/index';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  background-color: ${(props) => props.theme.colors['white']};
  flex: 1;
`;
export const ButtonRow = styled.View`
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 4px;
  padding: 20px;
`;

export const Pressable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: 100%;
  padding: 15px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 20px;
  background-color: rgba(249, 247, 247, 1);
  border-radius: 8px;
  margin: 10px 0px;
`;

export const TextContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding-left: 12px;
`;
