import { Content } from "@screens/Details/types"

import Text from "@components/Text"
import * as I from './styles'

const InfoCard = ({ anuncio }: Content) => {
  return (
    <I.Container>
      <I.Row>
        <I.Item>
          <Text color="black-700">Ano</Text>
          <Text color="black-700" fontStyle="p-14-bold">{anuncio.ano_fabricacao}/{anuncio.ano_modelo}</Text>
        </I.Item>
        <I.Item>
          <Text color="black-700">KM</Text>
          <Text color="black-700" fontStyle="p-14-bold">{anuncio.quilometragem}</Text>
        </I.Item>
        <I.Item>
          <Text color="black-700">Câmbio</Text>
          <Text color="black-700" fontStyle="p-14-bold">{anuncio.tipo_cambio.descricao}</Text>
        </I.Item>
      </I.Row>
      <I.Row>
        <I.Item>
          <Text color="black-700">Portas</Text>
          <Text color="black-700" fontStyle="p-14-bold">{anuncio.num_portas || 'N/A'}</Text>
        </I.Item>
        <I.Item>
          <Text color="black-700">Combustível</Text>
          <Text color="black-700" fontStyle="p-14-bold">{anuncio.tipo_combustivel.descricao}</Text>
        </I.Item>
        <I.Item>
          <Text color="black-700">Troca</Text>
          <Text color="black-700" fontStyle="p-14-bold" align="center">{anuncio.tipo_troca_str}</Text>
        </I.Item>
      </I.Row>
    </I.Container>
  )
}

export default InfoCard