import Text from '@components/Text'
import { Offer } from '@screens/Details/types'
import * as S from './styles'

export interface SpecificationParams {
  route: {
    params: Offer
  }
}

const Specifications = ({ route: { params } }: SpecificationParams) => {
  return (
    <S.Container>
      <S.Row>
        <S.Item>
          <Text color="black" fontStyle='p-14-bold'>Câmbio</Text>
          <Text color='black'>{params.tipo_cambio.descricao}</Text>
        </S.Item>
      </S.Row>
      <S.Row>
        <S.Item>
          <Text color="black" fontStyle='p-14-bold'>Combustível</Text>
          <Text color='black'>{params.tipo_combustivel.descricao}</Text>
        </S.Item>
      </S.Row>
    </S.Container>
  )
}

export default Specifications