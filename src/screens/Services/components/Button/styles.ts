import { shadow } from '@utils/index';
import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
  style: shadow.default,
})`
  background-color: ${(props) => props.theme.colors['red']};
  padding: 12px 24px;
  border-radius: 8px;
`;
