import styled from 'styled-components/native';

export interface ContainerProps {
  width?: string;
  direction?: 'row' | 'column';
  align?: 'center';
  justify?: 'center';
}

export const Container = styled.View<ContainerProps>`
  width: ${(props) => (props.width ? props.width + '%' : 'auto')};
  flex-direction: ${(props) => props.direction};
  align-items: ${(props) => props.align || 'flex-start'};
  justify-content: ${(props) => props.justify || 'flex-start'};
`;
