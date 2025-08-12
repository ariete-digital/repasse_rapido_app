import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  width: 100%;
  height: 88px;
  align-items: center;
  justify-content: center;
  padding: 8px 16px 8px 16px;
  background-color: ${(props) => props.theme.colors['clear-white']};
`;
