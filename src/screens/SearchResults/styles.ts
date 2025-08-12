import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  background-color: ${(props) => props.theme.colors['white']};
  flex: 1;
`;

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    gap: 20,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 30
  },
})`
  padding: 0px 10px;
  background-color: ${(props) => props.theme.colors['white']};
`;

export const HeaderButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin: 20px 0;
  width: 100%;
  flex-direction: row;
`;

export const HeaderButton = styled.TouchableOpacity`
  width: 45%;
`;

export const HeaderButtonLine = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${(props) => props.theme.colors['brand-blue']};
`;

export const LoaderContainer = styled.View`
  width: 100%;
  margin-top: 90%;
  align-items: center;
  justify-content: center;
`;

export const Pressable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: 50%;
  height: 60px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  background-color: #A0A4AC1A;
  border: 1px solid #EBE8D9;
`;
