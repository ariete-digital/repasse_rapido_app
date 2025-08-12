import { theme } from '@theme/GlobalStyles'
import * as B from './styles'

interface IButton extends B.ButtonProps {
  label: string
  onPress: () => void
  disabled?: boolean
}

const Button = ({ label, onPress, disabled, ...props }: IButton) => {
  return (
    <B.Pressable onPress={onPress} disabled={disabled}>
      <B.Container {...props}>
        <B.Label
          style={{
            color: theme.colors['white'],
            fontSize: 14,
            fontFamily: 'Cabin',
          }}
        >
          {label}
        </B.Label>
      </B.Container>
    </B.Pressable>
  )
}

export default Button
