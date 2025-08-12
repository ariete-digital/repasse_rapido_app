import { useState } from 'react'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { Modal, SafeAreaView, ScrollView, View } from 'react-native'

import * as T from './styles'
import { ModalProps } from '../types'
import Text from '@components/Text'
import { theme } from '@theme/GlobalStyles'
import GradientButton from '@components/GradientButton'

interface TermsProps extends ModalProps {
  handleNext: () => void
}

const Terms = ({ visible, setModalVisible, handleNext }: TermsProps) => {
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false)

  const handleModal = () => {
    handleNext()
  }

  return (
    <T.Container>
      <Modal
        animationType='fade'
        visible={visible}
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        <SafeAreaView>
          <ScrollView contentContainerStyle={{ padding: 8 }}>
            <View>
              <Text
                color="black-700"
                fontStyle="t-24"
                align="center"
                spacingY={8}
              >
                Termos e Condições
              </Text>
              <Text color='black'>
                O site repasserapido.com.br não tem vínculo com nenhum anunciante.O site repasserapido.com.br é apenas uma plataforma na qual o vendedor anuncia seu(s) veículo(s) para possiveis compradores.O site repasserapido.com.br NÃO é responsável pela veracidade das informações contidas nos anúncios.O site repasserapido.com.br é apenas uma plataforma publicitária digital que vende a informação de quem tem um veículo nas características para alguém que queria comprar.
              </Text>
            </View>

            <T.CheckboxContainer>
              <BouncyCheckbox
                onPress={() => setToggleCheckBox((prev) => !prev)}
                innerIconStyle={{
                  borderRadius: 1,
                  borderWidth: 1,
                  borderColor: theme.colors['gray-100'],
                  backgroundColor: theme.colors['gray-300'],
                }}
                textStyle={{
                  color: theme.colors['brand-blue'],
                }}
              />

              <Text color="black-700">Li e aceito os termos e condições.</Text>
            </T.CheckboxContainer>

            <T.PressableContainer>
              <GradientButton
                label="Prosseguir"
                onPress={handleModal}
                disabled={!toggleCheckBox}
                paddingY={12}
              />
            </T.PressableContainer>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </T.Container>
  )
}

export default Terms
