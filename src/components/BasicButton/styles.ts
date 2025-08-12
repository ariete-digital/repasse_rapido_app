import styled from 'styled-components/native';
export interface ButtonProps {
  width?: string;
  height?: number;
}

export const Container = styled.View<{ width: string }>`
  width: ${(props) => props.width};
`;
export const Pressable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})``;

export const Label = styled.Text``;
