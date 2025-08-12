import styled from 'styled-components/native';

import { Platform } from 'react-native';

export const Container = styled.View``;

export const DocumentsContainer = styled.View`
  margin-top: 30px;
`;

export const Spacer = styled.View`
  height: ${Platform.OS === 'android' ? '150px' : 0};
`;
