import styled from 'styled-components/native'

export interface ButtonProps {
  bgColor: string
  paddingY?: number
  paddingX?: number
  width?: number
  height?: number
}

export const Container = styled.View<ButtonProps>`
  align-items: center;
  justify-content: center; 
  width: ${(props) => props.width || 0}px;
  height: ${(props) => props.height || 0}px;
  padding-top: ${(props) => props.paddingY || 0}px;
  padding-bottom: ${(props) => props.paddingY || 0}px;
  padding-left: ${(props) => props.paddingX || 0}px;
  padding-right: ${(props) => props.paddingX || 0}px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors[props.bgColor]};
`
export const Pressable = styled.TouchableOpacity``
export const Label = styled.Text``
