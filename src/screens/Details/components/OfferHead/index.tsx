import { Text } from "@components/index"
import { Offer } from "@screens/Details/types"
import { currencyFormat } from "@utils/index"
import * as O from './styles'
import { View } from "react-native"
import { SvgXml } from "react-native-svg"
import { StarGoldIcon } from "@icons/StarGoldIcon"

interface OfferHeadProps {
  anuncio: Offer;
  anunciante?: {
    nome: string;
    cidade: {
      nome: string;
    };
  };
}

const OfferHead = ({ anuncio, anunciante }: OfferHeadProps) => {
  return (
    <O.Container>
      <Text color="black-700" fontStyle='t-24' style={{ fontWeight: 'bold' }}>{anuncio.marca_veiculo + ' ' + anuncio.modelo_veiculo}</Text>
      {/* <Text 
        color="black-700" 
        fontStyle="p-18-regular"
        spacingY={6}
      >
        {anuncio?.descricao || ""}
      </Text> */}
      <Text color="brand-red" style={{ fontWeight: 'bold' }} spacingX={4} spacingY={7} fontStyle='t-32'>{currencyFormat(anuncio.valor)}</Text>
      <View 
        style={{ display: 'flex', flexDirection: 'row', gap: 4 }}
      >
        <Text 
          color="black-500" 
          fontStyle="p-18-medium"
          spacingY={6}
        >
          Valor
        </Text>
        <Text 
          color="orange-text" 
          fontStyle="p-18-medium"
          spacingY={6}
        >
          FIPE {currencyFormat(anuncio.valor_fipe)}
        </Text>
      </View>
      <View  
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, marginTop: 20 }}
      >
        <View style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: 10,
          backgroundColor: '#E8E6DB80',
          padding: 10,
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
        }}>
          <Text 
            color="black-500" 
            fontStyle="p-14-bold"
            spacingY={6}
          >
            Selo
          </Text>
          <SvgXml xml={StarGoldIcon()} width={24} height={24} />
          <Text 
            color="yellow" 
            fontStyle="p-18-regular"
            spacingY={6}
          >
            OURO
          </Text>
        </View>
        <View style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          gap: 10,
          backgroundColor: '#E8E6DB80',
          padding: 10,
          width: '100%',
        }}>
          <Text 
            color="black-500" 
            fontStyle="p-18-regular"
            spacingY={6}
            style={{ width: 178 }}
          >
            {anunciante?.nome || 'Anunciante'}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <Text 
              color="black-200" 
              fontStyle="p-14-regular"
              spacingY={6}
            >
              Endereço:
            </Text>
            <View style={{ flex: 1 }}>
              <Text 
                color="black-200" 
                fontStyle="p-14-regular"
                spacingY={6}
              >
                {anunciante?.cidade?.nome || 'Cidade não informada'}
              </Text>
            </View>
          </View>
          <View style={{
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 10,
            backgroundColor: '#EBE8D9',
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 5,
            width: 130,
            height: 50,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}>

            <View style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: 15, 
              backgroundColor: "#E8CB57",
            }}>
              <Text 
                color="white" 
                fontStyle="p-14-bold"
                spacingY={6}
              >
                15
              </Text>
            </View>
            <View style={{ 
              display: 'flex', 
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              width: 70,
            }}>
              <Text 
                color="black-500" 
                fontStyle="c-12-medium"
                spacingY={6}
              >
                vendas realizadas
              </Text>
            </View>
          </View>
        </View>
      </View>
    </O.Container>
  )
}

export default OfferHead