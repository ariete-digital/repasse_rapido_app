import styled from 'styled-components/native';

export const Container = styled.View`
  display: flex;
  flex-direction: column;
  background-color: #FCFCFC;
  border: 1px solid #EBE8D9;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin: 0px 10px;
`;

export const Row = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 20px 10px;
  justify-content: space-between;
  align-items: flex-start;
`;

export const Item = styled.View`
  gap: 5px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;
