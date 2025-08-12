import { useNavigation } from '@react-navigation/native';
import { Image, View } from 'react-native';

import { HeaderLogo, Text } from '@components/index';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import * as S from './styles';
import BasicButton from '@components/BasicButton';

const ForgotPasswordSuccess = () => {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  return (
    <S.Container>
      <View
        style={{
          marginTop: 70,
          marginBottom: 70,
        }}
      >
        <HeaderLogo />
      </View>
      <Image source={require('@images/blueCircleCheckmark.png')} />
      <View>
        <Text color="brand-red-dark" fontStyle="t-24" align="center">
          Enviamos o link para seu e-mail!
        </Text>
        <Text color="black-700" align="center">
          Verifique sua caixa de entrada e siga as instruções.
        </Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          width: '100%',
          marginTop: 30,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <BasicButton
          label="Voltar ao login"
          onPress={() => navigation.navigate('login')}
          backgroundColor="#9A0B26"
          color="white"
        />
      </View>
    </S.Container>
  );
};

export default ForgotPasswordSuccess;

