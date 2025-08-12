import { shadow } from '@utils/index';
import styled from 'styled-components/native';

export const RegisterContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
  style: shadow.default,
})`
  background-color: ${(props) => props.theme.colors['white']};
  width: 45%;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => props.theme.colors['black']};
  border-radius: 8px;
  flex-direction: row;
`;
export const LoginContainer = styled.View`
  width: 45%;
`;
