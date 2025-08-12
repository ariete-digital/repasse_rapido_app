import styled from 'styled-components/native';

export const SafeContainer = styled.View`
  max-height: 100%;
`;

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    justifyContent: 'space-between',
    padding: 8,
    paddingVertical: 40,
  },
})`
  background-color: ${(props) => props.theme.colors['white']};
  height: 100%;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  gap: 5px;
  justify-content: space-around;
  height: 45px;
`;
