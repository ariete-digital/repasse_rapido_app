import { useState } from 'react'
import { Modal, SafeAreaView, ScrollView, View, Pressable } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { MaterialIcons } from '@expo/vector-icons'

import * as S from './styles'
import Text from '@components/Text'
import GradientButton from '@components/GradientButton'
import { theme } from '@theme/GlobalStyles'
import { SecurityModalProps } from '../types'
import BasicButton from '@components/BasicButton'

const Security = ({ visible, setModalVisible, onAccept }: SecurityModalProps) => {
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false)

  const handleModal = () => {
    if (toggleCheckBox && onAccept) {
      onAccept();
    }
    setModalVisible(false)
  }

  const handleClose = () => {
    setModalVisible(false)
  }

  return (
    <S.Container>
      <Modal
        animationType="fade"
        visible={visible}
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        <SafeAreaView>
          {/* Header com botão de fechar */}
          <S.HeaderContainer>
            <Pressable onPress={handleClose} style={{ padding: 10 }}>
              <MaterialIcons name="close" size={24} color="#353535" />
            </Pressable>
          </S.HeaderContainer>
          
          <ScrollView contentContainerStyle={{ paddingLeft: 30, paddingRight: 30, paddingTop: 0, paddingBottom: 20 }}>
            <View>
              <Text
                color="brand-red-dark"
                fontStyle="p-18-bold"
                align="center"
                spacingY={8}
              >
                🔒Dicas de Segurança
              </Text>
              <Text color="black-700" fontStyle="p-14-bold" spacingY={16} >
                Antes de efetuar qualquer pagamento, siga estas orientações para garantir uma negociação segura:
              </Text>
              <Text color="black-700" spacingY={5}>
                1- Nunca pague o carro em nome de terceiros. Opte sempre por pagar no nome do atual proprietário do veículo.
              </Text>
              <Text color="black-700" spacingY={5}>
                2- Realize um pagamento simbólico apenas para reserva, caso necessário.
              </Text>
              <Text color="black-700" spacingY={5}>
                3- Exija a vistoria cautelar do veículo antes de fechar o negócio.
              </Text>
              <Text color="black-700">
                4- Levante todos os débitos do veículo no DETRAN (multas, IPVA, licenciamento).
              </Text>
              <Text color="black-700" spacingY={5}>
                5- Se houver financiamento, desconte o valor da quitação do preço combinado.
              </Text>
              <Text color="black-700" spacingY={5}>
                6- Vá pessoalmente até o local onde o veículo está para conferi-lo.
              </Text>
              <Text color="black-700" spacingY={5}>
                7- Jamais entregue valores em dinheiro ou transfira para terceiros.
              </Text>
              <Text color="black-700" fontStyle="p-14-bold" spacingY={16} >
                ⚠️ Siga essas orientações e proteja-se contra golpes.             
              </Text>
            </View>

            <S.CheckboxContainer>
              <BouncyCheckbox
                onPress={() => setToggleCheckBox((prev) => !prev)}
                isChecked={toggleCheckBox}
                innerIconStyle={{
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: toggleCheckBox ? "#9A0B26" : "#EBE8D9",
                  backgroundColor: toggleCheckBox ? "#9A0B26" : "#F9F7F7",
                }}
                iconStyle={{
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: toggleCheckBox ? "#9A0B26" : "#EBE8D9",
                  backgroundColor: toggleCheckBox ? "#9A0B26" : "#F9F7F7",
                }}
                textStyle={{
                  color: theme.colors['brand-blue'],
                }}
              />

              <Text color="black-700" align="center">Li, entendi e concordo com as dicas de segurança</Text>
            </S.CheckboxContainer>

            <S.PressableContainer>
              <BasicButton
                label="Prosseguir"
                onPress={handleModal}
                backgroundColor='#9A0B26'
                color='white'
              />
            </S.PressableContainer>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </S.Container>
  )
}

export default Security
