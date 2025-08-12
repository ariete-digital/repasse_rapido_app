import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: ${(props) => props.theme.colors['white']};
  width: 100%;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors['gray-300']};
`;

export const IconRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  width: 100%;
`;

export const Item = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;
