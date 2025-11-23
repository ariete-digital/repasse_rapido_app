import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
export interface ButtonProps {
  paddingY?: number;
  paddingX?: number;
  width?: string;
  height?: number;
}

export const Container = styled.View<{ width: string }>`
  width: ${(props) => props.width};
`;
export const Pressable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})``;

export const Gradient = styled(LinearGradient)<ButtonProps>`
  align-items: center;
  justify-content: center;
  
  border-radius: 8px;
  flex-direction: row;
  width: ${(props) => props.width || '100%'};
  padding-top: ${(props) => props.paddingY || 0}px;
  padding-bottom: ${(props) => props.paddingY || 0}px;
  padding-left: ${(props) => props.paddingX || 0}px;
  padding-right: ${(props) => props.paddingX || 0}px;
`;
export const Label = styled.Text``;
