import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 0px 10px;
`;

export const ImgBackground = styled.ImageBackground<{
  alignItems: 'flex-start' | 'flex-end';
}>`
  width: 100%;
  height: 200px;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0;
  align-items: ${(props) => props.alignItems};
  border-radius: 8px;
`;

export const DataContainer = styled.View<{ width: string }>`
  width: ${(props) => props.width};
  align-items: center;
  gap: 10px;
`;
