import GradientButton from '@components/GradientButton'
import Text from '@components/Text'
import { openUrl } from '@utils/index'
import { View } from 'react-native'
import { Container, DataContainer, ImgBackground } from './styles'

import advogado from '@images/advogado.png'
import assessoria from '@images/assessoria.png'
import seguro from '@images/seguro.png'
import sell24 from '@images/sell_24_hrs.png'
import MoreInfo from '../Button'

export const SellVehicleCard = () => {
  return (
    <Container>
      <ImgBackground source={sell24} alignItems='flex-start'>
        <DataContainer width='60%'>
          <Text color='white' fontStyle='p-18-bold' align='center'>Venda seu veículo</Text>
          <Text color="white" fontStyle='p-18-bold' align='center'>em 24 horas!</Text>
          <Text color="white" fontStyle='p-14-bold' align='center'>Rapidez e segurança para você!</Text>
          <View style={{ width: '50%' }}>
            <GradientButton onPress={() => openUrl('https://marciarepasses.com.br/')} paddingY={8}>
              <Text color='white'>Saiba Mais</Text>
            </GradientButton>
          </View>
        </DataContainer>
      </ImgBackground>
    </Container>
  )
}

export const SpecialistHelpCard = () => {
  return (
    <Container>
      <ImgBackground source={assessoria} alignItems='flex-end'>
        <DataContainer width='65%'>
          <Text color='white' fontStyle='p-18-bold' align='center'>Quero a assessoria de</Text>
          <Text color="white" fontStyle='p-18-bold' align='center'>um especialista</Text>
          <Text color="white" fontStyle='p-14-bold' align='center'>Compre ou venda com segurança!</Text>
          <View style={{ width: '50%' }}>
            <GradientButton onPress={() => openUrl('https://assessoria.repasserapido.com.br/')} paddingY={8}>
              <Text color='white'>Saiba Mais</Text>
            </GradientButton>
          </View>
        </DataContainer>
      </ImgBackground>
    </Container>
  )
}

export const LawyerHelpCard = () => {
  return (
    <Container>
      <ImgBackground source={advogado} alignItems='flex-end'>
        <DataContainer width='50%'>
          <Text color='white' fontStyle='p-14-bold' align='center'>Preciso da ajuda de um</Text>
          <Text color="white" fontStyle='p-14-bold' align='center'>ADVOGADO!</Text>
          <Text color="white" fontStyle='p-10-bold' align='center'>Estou tendo problemas comprando ou vendendo um veículo</Text>
          <MoreInfo onPress={() => openUrl('https://grazianoadvogados.com.br/preciso-de-ajuda-de-um-advogado/')} />
        </DataContainer>
      </ImgBackground>
    </Container>

  )
}

export const SecurityCard = () => {
  return (
    <Container>
      <ImgBackground source={seguro} alignItems='flex-start'>
        <DataContainer width='55%'>
          <Text color='brand-blue' fontStyle='p-14-bold' align='center'>Não deixe seu veículo</Text>
          <Text color="brand-blue" fontStyle='p-14-bold' align='center'>desprotegido!</Text>
          <Text color="brand-blue" align='center' fontStyle='p-10-bold'>Faça a cotação do </Text>
          <Text color="brand-blue" align='center' fontStyle='p-10-bold'>seu seguro agora!</Text>
          <MoreInfo onPress={() => openUrl('https://serginhoseguros.repasserapido.com.br/')} />
        </DataContainer>
      </ImgBackground>
    </Container>
  )
}