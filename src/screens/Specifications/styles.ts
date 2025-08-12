import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.colors['white']};
`;

export const Row = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  padding: 0px 16px;
`;

export const Item = styled.View`
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 2px;
`;
