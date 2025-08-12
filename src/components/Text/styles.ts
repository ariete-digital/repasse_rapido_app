import styled from 'styled-components/native'
import { TextProps } from 'react-native'

import { Color, Text } from '../../theme/types'
import { styleBuilder } from '../../utils'

export interface TextElementProps extends Text, Color, TextProps {
  children?: string | React.ReactNode
  spacingY?: number
  spacingX?: number
}

export const TextElement = styled.Text<TextElementProps>`
  ${(props) => styleBuilder(props.fontStyle || 'p-14-regular')};
  color: ${(props) => props.theme.colors[props.color]};
  text-align: ${(props) => props.align || 'left'};
  text-decoration-line: ${(props) => props.decoration || 'none'};
  margin-top: ${(props) => props.spacingY || 0}px;
  margin-bottom: ${(props) => props.spacingY || 0}px;
  margin-left: ${(props) => props.spacingX || 0}px;
  margin-right: ${(props) => props.spacingX || 0}px;
`
