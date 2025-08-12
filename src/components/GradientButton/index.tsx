import { fromCSS } from '@bacons/css-to-expo-linear-gradient'
import { theme } from '@theme/GlobalStyles'
import * as B from './styles'
import React from 'react'

interface IButton extends B.ButtonProps {
  label?: string
  onPress: () => void
  disabled?: boolean
  children?: React.ReactNode
}

const GradientButton = ({ children, label, onPress, disabled, paddingX, paddingY = 4, width = "100%" }: IButton) => {
  return (
    <B.Container width={width}>
      <B.Pressable onPress={onPress} disabled={disabled}>
        <B.Gradient
          {...fromCSS(
            `linear-gradient(90deg, rgba(0,30,71,1) 0%, rgba(63,114,175,1) 100%)`
          )}
          paddingX={paddingX}
          paddingY={paddingY}
        >
          {
            children ? children :
              <B.Label
                style={{
                  color: theme.colors['white'],
                  fontSize: 14,
                  fontFamily: 'Cabin',
                }}
              >
                {label}
              </B.Label>
          }
        </B.Gradient>
      </B.Pressable>
    </B.Container>
  )
}

export default GradientButton
