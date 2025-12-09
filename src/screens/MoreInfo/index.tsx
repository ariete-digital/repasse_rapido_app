import { Text } from '@components/index';
import { Offer } from '@screens/Details/types';
import * as M from './styles';
import { Pressable, View, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@routes/app.routes';

export interface MoreInfoParams {
  route: {
    params: Offer;
  };
}

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList
>;

const MoreInfo = ({ route: { params } }: MoreInfoParams) => {
  const navigation = useNavigation<NavigationProps>();

  const convertAnswer = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return '-';
    if (value === 0 || value === 'N' || value === '0') return 'Não';
    if (value === 1 || value === 'S' || value === '1') return 'Sim';
    return '-';
  };

  const getStringValue = (value: string | null | undefined) => {
    return value && value.trim() !== '' ? value : '-';
  };

  return (
    <M.Container>
      <View style={{ paddingTop: 21, paddingBottom: 13, borderBottomColor: '#EBE8D9', borderBottomWidth: 1 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <Image source={require('@icons/arrow.png')} />
          <Text color="black" fontStyle="p-18-bold">
            Mais informações
          </Text>
        </Pressable>
      </View>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Aceita troca?
          </Text>
          <Text color="black">{getStringValue(params.tipo_troca_str)}</Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            Leilão?
          </Text>
          <Text color="black">{convertAnswer(params.passou_leilao)}</Text>
        </M.RightItem>
      </M.Row>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Tipo de leilão
          </Text>
          <Text color="black">-</Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            Manual do proprietário
          </Text>
          <Text color="black">{convertAnswer(params.possui_manual)}</Text>
        </M.RightItem>
      </M.Row>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Dono
          </Text>
          <Text color="black">{getStringValue(params.unico_dono_str)}</Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            Financiado
          </Text>
          <Text color="black">{convertAnswer(params.financiado)}</Text>
        </M.RightItem>
      </M.Row>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Todas as revisões em concessionárias
          </Text>
          <Text color="black">
            {convertAnswer(params.todas_revisoes_concessionaria)}
          </Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            IPVA do ano atual pago
          </Text>
          <Text color="black">{convertAnswer(params.ipva_pago)}</Text>
        </M.RightItem>
      </M.Row>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Parcelas em dia
          </Text>
          <Text color="black">{convertAnswer(params.parcelas_em_dia)}</Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            Chave reserva
          </Text>
          <Text color="black">
            {convertAnswer(params.possui_chave_reserva)}
          </Text>
        </M.RightItem>
      </M.Row>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Ar condicionado funcionando?
          </Text>
          <Text color="black">{convertAnswer(params.ar_funcionando)}</Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            Aceita financiamento?
          </Text>
          <Text color="black">
            {convertAnswer(params.aceita_financiamento)}
          </Text>
        </M.RightItem>
      </M.Row>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Garantia de fábrica
          </Text>
          <Text color="black">{convertAnswer(params.garantia_fabrica)}</Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            Motor bate ou raja?
          </Text>
          <Text color="black">{convertAnswer(params.motor_bate)}</Text>
        </M.RightItem>
      </M.Row>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Câmbio faz barulho estranho?
          </Text>
          <Text color="black">{convertAnswer(params.cambio_faz_barulho)}</Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            Câmbio escapa alguma marcha?
          </Text>
          <Text color="black">
            {convertAnswer(params.cambio_escapa_marcha)}
          </Text>
        </M.RightItem>
      </M.Row>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Estado dos pneus
          </Text>
          <Text color="black">
            {params.tipo_pneu && params.tipo_pneu.descricao
              ? params.tipo_pneu.descricao
              : '-'}
          </Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            Parabrisa
          </Text>
          <Text color="black">
            {params.tipo_parabrisa && params.tipo_parabrisa.descricao
              ? params.tipo_parabrisa.descricao
              : '-'}
          </Text>
        </M.RightItem>
      </M.Row>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Alguma luz de injeção acesa?
          </Text>
          <Text color="black">{convertAnswer(params.luz_injecao)}</Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            Alguma luz de airbag acesa?
          </Text>
          <Text color="black">{convertAnswer(params.luz_airbag)}</Text>
        </M.RightItem>
      </M.Row>
      <M.Row>
        <M.LeftItem>
          <Text color="black" fontStyle="p-14-bold">
            Alguma luz de ABS acesa?
          </Text>
          <Text color="black">{convertAnswer(params.luz_abs)}</Text>
        </M.LeftItem>
        <M.RightItem>
          <Text color="black" fontStyle="p-14-bold">
            Colisão?
          </Text>
          <Text color="black">{getStringValue(params.tipo_monta_str) || convertAnswer(params.tipo_monta)}</Text>
        </M.RightItem>
      </M.Row>
    </M.Container>
  );
};

export default MoreInfo;
