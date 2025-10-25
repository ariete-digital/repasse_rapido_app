import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
})`
  width: 100%;
  height: 100%;
  padding: 15px 0 20px 0;
  background-color: ${(props) => props.theme.colors['clear-white']};
`;

export const TabContainer = styled.View`
  flex-direction: row;
  padding: 12px 30px;
  margin-top: 10px;
`;

export const TabButton = styled.TouchableOpacity`
  width: 34%;
  height: 46px;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-width: 1px;
  border-color: #F3F2ED;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
`;

export const TabContent = styled.View`
  width: 100%;
  height: 100%;
  padding: 0 30px;
`;

export const HeaderImageContainer = styled.View`
  margin-bottom: 15px;
`;
