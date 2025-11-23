import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { GearIcon } from '@icons/GearIcon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PageScaffold from '@components/PageScaffold';
import AdCard from '@components/AdCard';
import Text from '@components/Text';
import ImageViewer from '@screens/Details/components/ImageViewer';
import { api } from '@lib/api';
import * as S from './styles';

type ManageAdsNavigationProp = NativeStackNavigationProp<any>;

interface Anuncio {
  id: number;
  marca_veiculo: string;
  modelo_veiculo: string;
  submodelo: string;
  ano_fabricacao: string;
  ano_modelo: string;
  created_at: string;
  codigo: string;
  status_str: string;
  moderacao_str: string;
  ativo: boolean;
  pausado: boolean;
  vendido_em: string | null;
  imagens?: Array<{
    id: number;
    link?: string;
    arquivo?: string;
    principal: number;
  }>;
  imagemPrincipal?: string;
}

interface MeusAnunciosResponse {
  status: string;
  content: {
    anuncios: Anuncio[];
    tipo_cliente: string;
  };
}

const ManageAds = () => {
  const navigation = useNavigation<ManageAdsNavigationProp>();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  useEffect(() => {
    loadAnuncios();
  }, []);

  const loadAnuncios = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<MeusAnunciosResponse>('/cliente/meus_anuncios');

      if (response.data.status === 'success' && response.data.content.anuncios) {
        setAnuncios(response.data.content.anuncios);
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível carregar seus anúncios. Tente novamente mais tarde.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewImages = (adId: string) => {
    const anuncio = anuncios.find(ad => ad.id.toString() === adId);
    
    if (!anuncio) {
      Alert.alert('Erro', 'Anúncio não encontrado');
      return;
    }

    const images: string[] = [];

    if (anuncio.imagemPrincipal) {
      images.push(anuncio.imagemPrincipal);
    }

    if (anuncio.imagens && anuncio.imagens.length > 0) {
      anuncio.imagens.forEach(img => {
        const imageUrl = img.link || img.arquivo;
        if (imageUrl && !images.includes(imageUrl)) {
          images.push(imageUrl);
        }
      });
    }

    if (images.length === 0) {
      Alert.alert('Aviso', 'Este anúncio não possui imagens para visualizar.');
      return;
    }

    setCurrentImages(images);
    setImageViewerVisible(true);
  };

  const handleEdit = (adId: string) => {
    Alert.alert('Em desenvolvimento', 'Funcionalidade de edição em breve!');
  };

  const handleResume = (adId: string) => {

    const anuncio = anuncios.find(ad => ad.id.toString() === adId);

    if (!anuncio) {
      Alert.alert('Erro', 'Anúncio não encontrado');
      return;
    }

    // @ts-ignore
    navigation.navigate('AppTabs', { 
      screen: 'sell',
      params: {
        screen: 'advertiseStep1',
        params: { editCodigo: anuncio.codigo }
      }
    });
  };

  const handleMarkSold = (adId: string) => {
    Alert.alert(
      'Marcar como vendido',
      'Tem certeza que deseja marcar este veículo como vendido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar',
          onPress: async () => {
            try {
              const response = await api.post('/cliente/meus_anuncios/marcar_vendido', {
                id_anuncio: parseInt(adId),
              });

              if (response.data.status === 'success') {
                Alert.alert('Sucesso', response.data.content.message || 'Anúncio marcado como vendido!');
                await loadAnuncios(); 
              } else {
                throw new Error(response.data.message || 'Erro ao marcar como vendido');
              }
            } catch (error: any) {
              const errorMessage = error.response?.data?.message || 'Não foi possível marcar o veículo como vendido.';
              Alert.alert('Erro', errorMessage);
            }
          }
        }
      ]
    );
  };

  return (
    <PageScaffold
      titleText={'Gerenciar meus anúncios'}
      titleIcon={<SvgXml xml={GearIcon()} width={20} height={20} />}
    >
      <S.ContentContainer>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#9A0B26" />
            <Text fontStyle="p-14-regular" color="gray-500" style={{ marginTop: 16 }}>
              Carregando seus anúncios...
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {anuncios.length > 0 ? (
              anuncios.map((ad) => {
                
                const images: string[] = [];
                if (ad.imagemPrincipal) {
                  images.push(ad.imagemPrincipal);
                }
                if (ad.imagens && ad.imagens.length > 0) {
                  ad.imagens.forEach(img => {
                    const imageUrl = img.link || img.arquivo;
                    if (imageUrl && !images.includes(imageUrl)) {
                      images.push(imageUrl);
                    }
                  });
                }

                return (
                  <AdCard
                    key={ad.id}
                    id={ad.id.toString()}
                    brand={ad.marca_veiculo}
                    model={ad.modelo_veiculo}
                    description={`${ad.submodelo} ${ad.ano_fabricacao}/${ad.ano_modelo}`}
                    imageUrl={ad.imagemPrincipal}
                    images={images}
                    createdAt={ad.created_at}
                    adNumber={ad.id.toString()}
                    isVendido={!!ad.vendido_em}
                    onViewImages={() => handleViewImages(ad.id.toString())}
                    onEdit={() => handleEdit(ad.id.toString())}
                    onResume={() => handleResume(ad.id.toString())}
                    onMarkSold={() => handleMarkSold(ad.id.toString())}
                  />
                );
              })
            ) : (
              <S.EmptyState>
                <S.EmptyStateText>
                  Você ainda não possui anúncios cadastrados.
                </S.EmptyStateText>
              </S.EmptyState>
            )}
          </ScrollView>
        )}
      </S.ContentContainer>

      <ImageViewer
        visible={imageViewerVisible}
        onClose={() => setImageViewerVisible(false)}
        images={currentImages}
        initialIndex={0}
      />
    </PageScaffold>
  );
};

export default ManageAds;
