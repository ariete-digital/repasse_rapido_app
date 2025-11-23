import GradientLine from '@components/GradientLine';
import Text from '@components/Text';
import { Call, Fipe, Stores } from '@icons/index';
import HeaderUserRow from '@screens/Home/components/HeaderUserRow';
import { openUrl, shadow } from '@utils/index';
import { Image, ScrollView } from 'react-native';
import {
  LawyerHelpCard,
  SecurityCard,
  SellVehicleCard,
  SpecialistHelpCard,
} from './components/Cards';
import * as S from './styles';

const Services = () => {
  return (
    <S.Container>
      <HeaderUserRow />
      <GradientLine />
      <ScrollView
        contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
        style={{ flex: 1 }}
      >
        <Text color="black" fontStyle="t-32" spacingX={8}>
          Serviços
        </Text>

        <S.ButtonRow>
          <S.Pressable
            style={shadow.services}
            onPress={() => openUrl('https:
          >
            <Image source={Fipe} style={{ width: 80, height: 80 }} />
            <S.TextContainer>
              <Text color="black" fontStyle="p-16-bold">
                Tabela FIPE
              </Text>
              <Text color="black" fontStyle="p-14-regular">
                Consulte o preço médio de veículos novos e usados.
              </Text>
            </S.TextContainer>
          </S.Pressable>
          <S.Pressable
            style={shadow.services}
            onPress={() => openUrl('https:
          >
            <Image source={Stores} style={{ width: 80, height: 80 }} />
            <S.TextContainer>
              <Text color="black" fontStyle="p-16-bold">
                Lojas
              </Text>
              <Text color="black" fontStyle="p-14-regular">
                Encontre uma revenda parceira Repasse Rápido.
              </Text>
            </S.TextContainer>
          </S.Pressable>
          <S.Pressable
            style={shadow.services}
            onPress={() => openUrl('https:
          >
            <Image source={Call} style={{ width: 80, height: 80 }} />
            <S.TextContainer>
              <Text color="black" fontStyle="p-16-bold">
                Fale Conosco
              </Text>
              <Text color="black" fontStyle="p-14-regular">
                Entre em contato e tira suas dúvidas.
              </Text>
            </S.TextContainer>
          </S.Pressable>
        </S.ButtonRow>
      </ScrollView>
    </S.Container>
  );
};

export default Services;
