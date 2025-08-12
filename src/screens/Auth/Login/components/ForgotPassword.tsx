import { Text } from '@components/index'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { TouchableOpacity } from 'react-native'

const ForgotPasswordButton = () => {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  return (
    <TouchableOpacity onPress={() => navigation.navigate('forgotPassword')}>
      <Text color="brand-blue" fontStyle="c-12-medium">
        Esqueci minha senha
      </Text>
    </TouchableOpacity>
  )
}

export default ForgotPasswordButton
