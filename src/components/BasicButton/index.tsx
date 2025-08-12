import { fromCSS } from '@bacons/css-to-expo-linear-gradient'
import { theme } from '@theme/GlobalStyles'
import * as B from './styles'
import React from 'react'

interface IButton extends B.ButtonProps {
  label?: string
  color?: string
  backgroundColor?: string
  onPress: () => void
  disabled?: boolean
  children?: React.ReactNode
  customStyles?: any
}

const BasicButton = ({ children, label, onPress, disabled, width = "100%", color, backgroundColor, customStyles = {} }: IButton) => {
  return (
    <B.Container width={width}>
      <B.Pressable onPress={onPress} disabled={disabled} style={{
        backgroundColor: backgroundColor || theme.colors['brand-blue'],
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        ...customStyles 
      }}>
        {
          children ? children :
            <B.Label
              style={{
                color: color || theme.colors['clear-white'],
                fontSize: 14,
                fontWeight: 'bold',
                fontFamily: 'Cabin',
              }}
            >
              {label}
            </B.Label>
        }
      </B.Pressable>
    </B.Container>
  )
}

export default BasicButton
