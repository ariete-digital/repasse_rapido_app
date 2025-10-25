import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 32px;
  background-color: ${(props: any) => props.theme.colors['clear-white']};
  padding: 0 30px;
`;
