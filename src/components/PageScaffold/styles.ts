import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors['clear-white']};
`;

export const Header = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px 8px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors['gray-200']};
`;

export const UserSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 30px;
  background-color: ${(props) => props.theme.colors['clear-white']};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors['gray-200']};
`;

export const UserInfo = styled.View`
  flex: 1;
  gap: 8px
`;

export const UserTag = styled.View`
  background-color: ${(props) => props.theme.colors['brand-red']};
  padding: 6px 12px;
  padding-right: 40px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  position: absolute;
  right: 0;
  top: 18px
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TitleIcon = styled.View`
  margin-right: 16px;
  width: 24px;
  align-items: center;
  justify-content: center;
`;

export const TitleText = styled.View`
  flex: 1;
`;

export const Separator = styled.View`
  height: 1px;
  background-color: ${(props) => props.theme.colors['gray-200']};
`;


