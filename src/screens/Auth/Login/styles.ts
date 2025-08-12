import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    alignItems: 'center',
  },
})`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors['clear-white']};
  padding: 15px 0 20px 0;
`;

export const Header = styled.View`
  padding: 16px 0;
  padding-top: 30px;
`;

export const Form = styled.ScrollView.attrs({
  contentContainerStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20
  },
})`
  width: 100%;
  height: auto;
  padding: 30px;
  gap: 16px;
`;
