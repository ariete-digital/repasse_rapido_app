import {
  ActivityIndicator,
  RefreshControl,
  View,
} from 'react-native';
import { useHome } from '@hooks/useHome';
import HeaderHome from './components/HeaderBanner';
import HeaderUserRow from './components/HeaderUserRow';

import * as H from './styles';
import { StoresArea } from './components/StoresArea';
import ItemCard from '@components/ItemCard';
import Text from '@components/Text';

const Home = () => {
  const { isLoading, loadHomePageData, homePageData } = useHome();

  const renderAds = () => {
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
          <ActivityIndicator size="large" color="#E11138" />
        </View>
      );
    }

    if (!homePageData.anuncios || homePageData.anuncios.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
          <Text color="black-500" fontStyle="p-18-regular">
            Nenhum anúncio encontrado
          </Text>
        </View>
      );
    }

    const getImageUrl = (ad: any) => {
      
      if (ad.imagemPrincipal) {
        return ad.imagemPrincipal;
      }

      if (ad.imagens && ad.imagens.length > 0) {
        const firstImage = ad.imagens[0];
        if (typeof firstImage === 'string') return firstImage;
        return firstImage.link || firstImage.arquivo || undefined;
      }
      
      return undefined;
    };

    const rows = [];
    for (let i = 0; i < homePageData.anuncios.length; i += 2) {
      const firstAd = homePageData.anuncios[i];
      const secondAd = homePageData.anuncios[i + 1];
      
      rows.push(
        <H.RowContainer key={`row-${i}`}>
          <ItemCard
            itemID={firstAd.id}
            codigo={firstAd.codigo}
            key={firstAd.codigo}
            brand={firstAd.marca_veiculo}
            model={firstAd.modelo_veiculo}
            description={firstAd.submodelo || ''}
            imageUrl={getImageUrl(firstAd)}
            price={firstAd.valor ? firstAd.valor.toString() : '0'}
            fipePrice={firstAd.valor_fipe ? firstAd.valor_fipe.toString() : '0'}
            storeName={firstAd.cliente?.nome || 'Anunciante'}
            itemPerRow={2}
            isVendido={!!firstAd.vendido_em}
          />
          {secondAd && (
            <ItemCard
              itemID={secondAd.id}
              codigo={secondAd.codigo}
              key={secondAd.codigo}
              brand={secondAd.marca_veiculo}
              model={secondAd.modelo_veiculo}
              description={secondAd.submodelo || ''}
              imageUrl={getImageUrl(secondAd)}
              price={secondAd.valor ? secondAd.valor.toString() : '0'}
              fipePrice={secondAd.valor_fipe ? secondAd.valor_fipe.toString() : '0'}
              storeName={secondAd.cliente?.nome || 'Anunciante'}
              itemPerRow={2}
              isVendido={!!secondAd.vendido_em}
            />
          )}
        </H.RowContainer>
      );
    }

    return <>{rows}</>;
  };

  return (
    <H.Container>
      <HeaderUserRow />
      <H.ScrollingContent
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadHomePageData}
            colors={['rgba(154, 11, 38, 1)', 'rgba(225, 17, 56, 1)']} 
            tintColor="rgba(225, 17, 56, 1)" 
          />
        }
      >
        <HeaderHome />
        <H.OffersContainer>
          {renderAds()}
        </H.OffersContainer>
        <StoresArea />
      </H.ScrollingContent>
    </H.Container>
  );
};

export default Home;
