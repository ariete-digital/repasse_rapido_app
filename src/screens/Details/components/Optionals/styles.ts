import styled from "styled-components/native";

export const Container = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors['gray-300']};
  margin: 20px 10px 10px 10px;
  padding-bottom: 20px;

`;
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
export const Pressable = styled.TouchableOpacity``;
export const Items = styled.View`
    gap: 10px;
`;
export const Item = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;