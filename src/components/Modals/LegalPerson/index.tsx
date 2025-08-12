import { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import * as S from './styles';
import Text from '@components/Text';
import GradientButton from '@components/GradientButton';
import { theme } from '@theme/GlobalStyles';
import { ModalProps } from '../types';

const LegalPerson = ({ visible, setModalVisible }: ModalProps) => {
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);

  const handleModal = () => {
    setModalVisible(false);
  };

  return (
    <S.Container>
      <Modal
        animationType="fade"
        visible={visible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <SafeAreaView>
          <ScrollView contentContainerStyle={{ padding: 8 }}>
            <View>
              <Text color='black' fontStyle='t-24' spacingY={12}>
                Repasses
              </Text>
              <Text color="black" fontStyle="p-14-bold" spacingY={12}>
                Esta é uma área restrita a Empresas com CNPJ.
              </Text>
              <Text
                color="black"
                fontStyle="p-14-bold"
                spacingY={12}
                style={{ lineHeight: 24 }}
              >
                Os veículos anunciados nesse ambiente são todos direcionados a
                lojistas e comerciantes de veículos, são veículos no estado que
                se encontram, sem garantia mecânica, elétrica ou de defeitos
                ocultos.
              </Text>
              <Text color="black" spacingY={12} style={{ lineHeight: 24 }}>
                Ainda que se tratando de um ambiente direcionado a Lojistas e
                Comerciantes, solicitamos passar a BALIZA do veículo no anuncio
                o mais exata possível, pois, partindo do princípio que a Parte
                Vendedora como a Parte Compradora , ambas as partes são
                profissionais da área automotiva a linguagem deve ser clara e
                franca quanto a realidade do veículo.A garantia e
                responsabilidade pela parte documental segue a rigor o que a lei
                determina que é: Até a data da venda o vendedor é responsável
                por tudo, tanto Cívil como Criminal que envolva o veículo
                anunciado, inclusive multas.
              </Text>
              <Text color="black" style={{ lineHeight: 24 }}>
                A garantia e responsabilidade pela parte documental segue a
                rigor o que a lei determina que é: Até a data da venda o
                vendedor é responsável por tudo, tanto Cívil como Criminal que
                envolva o veículo anunciado, inclusive multas.
              </Text>
            </View>

            <S.CheckboxContainer>
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
            </S.CheckboxContainer>

            <S.PressableContainer>
              <GradientButton
                label="Prosseguir"
                onPress={handleModal}
                disabled={!toggleCheckBox}
                paddingY={12}
              />
            </S.PressableContainer>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </S.Container>
  );
};

export default LegalPerson;
