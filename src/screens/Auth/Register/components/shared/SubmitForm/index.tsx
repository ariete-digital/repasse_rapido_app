import { GradientButton, Text } from '@components/index';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import * as S from './styles';
import BasicButton from '@components/BasicButton';

interface SubmitFormProps {
  handleRegister: () => void;
  disabled: boolean;
}

export const SubmitForm = ({ handleRegister, disabled }: SubmitFormProps) => {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  
  const handlePress = () => {
    handleRegister();
  };
  
  return (
    <S.Container>
      <S.Terms>
        <Text color="black-700" align='center' fontStyle="c-12-medium">
          Ao clicar no botão abaixo aceito os{' '}
          <Text
            color="black-700"
            decoration="underline"
            align='center'
            fontStyle="c-12-medium"
          >
            Termos de Uso e Política de Privacidade.
          </Text>
        </Text>
      </S.Terms>
      <View
        style={{
          alignItems: "center",
          flex: 1,
          width: "100%",
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <BasicButton
          label="Cadastrar"
          onPress={handlePress}
          backgroundColor='#9A0B26'
          color='white'
          disabled={disabled}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('login')}
        disabled={disabled}
      >
        <Text color="black-700">
          Já é cadastrado? Faça seu{' '}
          <Text color="black-700" decoration="underline">
            LOGIN
          </Text>
          .
        </Text>
      </TouchableOpacity>
    </S.Container>
  );
};
