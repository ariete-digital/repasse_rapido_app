import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { GearIcon } from '@icons/GearIcon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PageScaffold from '@components/PageScaffold';
import AdCard from '@components/AdCard';
import Text from '@components/Text';
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

  // Carregar anúncios ao montar o componente
  useEffect(() => {
    loadAnuncios();
  }, []);

  const loadAnuncios = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<MeusAnunciosResponse>('/cliente/meus_anuncios');
      
      console.log('Meus anúncios response:', response.data);
      
      if (response.data.status === 'success' && response.data.content.anuncios) {
        setAnuncios(response.data.content.anuncios);
      }
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar seus anúncios. Tente novamente mais tarde.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (adId: string) => {
    console.log('Deletar anúncio:', adId);
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este anúncio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implementar chamada da API para deletar
              // await api.delete(`/cliente/meus_anuncios/${adId}`);
              await loadAnuncios(); // Recarregar lista
            } catch (error) {
              console.error('Erro ao deletar anúncio:', error);
              Alert.alert('Erro', 'Não foi possível excluir o anúncio.');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (adId: string) => {
    console.log('Editar anúncio:', adId);
    Alert.alert('Em desenvolvimento', 'Funcionalidade de edição em breve!');
  };

  const handleResume = (adId: string) => {
    console.log('Retomar anúncio:', adId);
    
    // Buscar o código do anúncio
    const anuncio = anuncios.find(ad => ad.id.toString() === adId);
    if (!anuncio) {
      Alert.alert('Erro', 'Anúncio não encontrado');
      return;
    }

    // Navegar diretamente para Step1 com editCodigo
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
    console.log('Marcar como vendido:', adId);
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
                await loadAnuncios(); // Recarregar lista
              } else {
                throw new Error(response.data.message || 'Erro ao marcar como vendido');
              }
            } catch (error: any) {
              console.error('Erro ao marcar como vendido:', error);
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
              anuncios.map((ad) => (
                <AdCard
                  key={ad.id}
                  id={ad.id.toString()}
                  brand={ad.marca_veiculo}
                  model={ad.modelo_veiculo}
                  description={`${ad.submodelo} ${ad.ano_fabricacao}/${ad.ano_modelo}`}
                  imageUrl={ad.imagemPrincipal}
                  createdAt={ad.created_at}
                  adNumber={ad.id.toString()}
                  isVendido={!!ad.vendido_em}
                  onDelete={() => handleDelete(ad.id.toString())}
                  onEdit={() => handleEdit(ad.id.toString())}
                  onResume={() => handleResume(ad.id.toString())}
                  onMarkSold={() => handleMarkSold(ad.id.toString())}
                />
              ))
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
    </PageScaffold>
  );
};

export default ManageAds;
