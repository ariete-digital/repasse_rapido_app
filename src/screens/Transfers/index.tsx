import Text from '@components/Text';
import { useState } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';

import GradientLine from '@components/GradientLine';
import LegalPerson from '@components/Modals/LegalPerson';
import TextContainer from '@components/TextContainer';
import { useAuth } from '@hooks/useAuth';
import { useFilters } from '@hooks/useFilters';
import HeaderUserRow from '@screens/Home/components/HeaderUserRow';
import ItemCard from '@screens/SearchResults/components/ItemCard';
import { LoaderContainer } from '@screens/SearchResults/styles';
import LoginButton from './components/Button/Login';
import RegisterButton from './components/Button/Register';
import * as T from './styles';

const Transfers = () => {
  const [showTransferModal, setShowTransferModal] = useState<boolean>(true);

  const { user } = useAuth();

  const {
    transferSearchResults,
    isTransferSearchResultsLoading,
    isTransferSearchResultsRefetching,
  } = useFilters();

  const transferItems = transferSearchResults?.anuncios?.filter(
    (offer) => offer.tipo_venda === 'R'
  );

  return (
    <T.SafeContainer>
      <HeaderUserRow />
      <StatusBar barStyle={'dark-content'} />
      <GradientLine />

      <T.Container>
        <Text color="black" fontStyle="t-32">
          Carros de Repasse
        </Text>
        {!user.access_token || user.tipo === 'PF' ? (
          <>
            <TextContainer>
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
              <Text color="black" style={{ lineHeight: 24 }}>
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
            </TextContainer>
            <TextContainer align="center">
              <Text
                color="black"
                fontStyle="p-16-bold"
                align="center"
                spacingY={24}
              >
                Para anunciar ou comprar cadastre-se ou faça login como Pessoa
                Jurídica.
              </Text>
            </TextContainer>
            <T.ButtonRow>
              <RegisterButton />
              <LoginButton />
            </T.ButtonRow>
          </>
        ) : (
          <>
            <LegalPerson
              setModalVisible={setShowTransferModal}
              visible={showTransferModal}
            />
            {isTransferSearchResultsLoading ||
            isTransferSearchResultsRefetching ? (
              <LoaderContainer>
                <ActivityIndicator />
              </LoaderContainer>
            ) : (
              transferItems?.map((item) => (
                <View style={{ marginVertical: 8 }} key={item.codigo}>
                  <ItemCard {...item} />
                </View>
              ))
            )}
          </>
        )}
      </T.Container>
    </T.SafeContainer>
  );
};

export default Transfers;
