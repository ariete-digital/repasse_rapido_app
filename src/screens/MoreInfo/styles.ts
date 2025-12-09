import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.colors['white']};
  padding-left: 30px;
  padding-right: 30px;
  gap: 10px;
`;

export const Row = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

export const LeftItem = styled.View`
  flex-direction: column;
  width: 48%;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 2px;
`;

export const RightItem = styled.View`
  flex-direction: column;
  width: 48%;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 2px;
`;
