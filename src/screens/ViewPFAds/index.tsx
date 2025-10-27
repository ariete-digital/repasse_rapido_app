import React, { useState, useEffect } from 'react';
import { ScrollView, View, Alert, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { EyeIcon } from '@icons/EyeIcon';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import PageScaffold from '@components/PageScaffold';
import AdCardPF from '@components/AdCardPF';
import SearchFilters from '@components/SearchFilters';
import Text from '@components/Text';
import { getPFAds, publishAd, PFAd } from '@services/pfAds';
import * as S from './styles';

const ViewPFAds = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const { data: pfAdsData, isLoading, isError, error } = useQuery({
    queryKey: ['pf-ads'],
    queryFn: getPFAds,
    staleTime: 5 * 60 * 1000,
  });

  const publishMutation = useMutation({
    mutationFn: publishAd,
    onSuccess: (data) => {
      Alert.alert('Sucesso', 'Anúncio publicado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['pf-ads'] });
    },
    onError: (error) => {
      Alert.alert('Erro', 'Erro ao publicar anúncio. Tente novamente.');
    },
  });

  const filteredAds = pfAdsData?.content?.anuncios?.filter((ad) => {
    const matchesSearch = searchTerm === '' || 
      ad.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.marca_veiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.modelo_veiculo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === '' || 
      ad.cidadeAnunciante.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  }) || [];

  const handleDelete = (adId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este anúncio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implementar lógica de exclusão
          }
        }
      ]
    );
  };

  const handleEdit = (adId: string) => {
    navigation.navigate('AppTabs' as never, {
      screen: 'sell',
      params: {
        screen: 'advertiseStep1',
        params: { editCodigo: adId }
      }
    } as never);
  };

  const handleEditAndPublish = (adId: string) => {
    navigation.navigate('AppTabs' as never, {
      screen: 'sell',
      params: {
        screen: 'advertiseStep1',
        params: { 
          editCodigo: adId,
          shouldPublish: true 
        }
      }
    } as never);
  };

  const handleAdNumberSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
  };

  const getImageUrl = (ad: PFAd): string | undefined => {
    if (ad.imagemPrincipal) {
      return ad.imagemPrincipal;
    }
    if (ad.imagens && ad.imagens.length > 0) {
      return ad.imagens[0];
    }
    return undefined;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <PageScaffold
        titleText={'Visualizar anúncios de PF'}
        titleIcon={<SvgXml xml={EyeIcon()} width={20} height={20} />}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text fontStyle="p-16-regular" color="black-200" style={{ marginTop: 16 }}>
            Carregando anúncios...
          </Text>
        </View>
      </PageScaffold>
    );
  }

  if (isError) {
    return (
      <PageScaffold
        titleText={'Visualizar anúncios de PF'}
        titleIcon={<SvgXml xml={EyeIcon()} width={20} height={20} />}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text fontStyle="p-16-bold" color="red-500">
            Erro ao carregar anúncios
          </Text>
          <Text fontStyle="p-14-regular" color="black-200" style={{ marginTop: 8, textAlign: 'center' }}>
            {error?.message || 'Tente novamente mais tarde'}
          </Text>
        </View>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold
      titleText={'Visualizar anúncios de PF'}
      titleIcon={<SvgXml xml={EyeIcon()} width={20} height={20} />}
    >
      <S.ContentContainer>
        <SearchFilters
          onAdNumberChange={handleAdNumberSearch}
          onLocationChange={handleLocationChange}
        />
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredAds.length > 0 ? (
            filteredAds.map((ad) => (
              <AdCardPF
                key={ad.id}
                id={ad.codigo}
                brand={ad.marca_veiculo}
                model={ad.modelo_veiculo}
                description={`${ad.ano_fabricacao}/${ad.ano_modelo} - ${ad.tipo_cambio.descricao} - ${ad.tipo_combustivel.descricao}`}
                imageUrl={getImageUrl(ad)}
                createdAt={formatDate(ad.created_at)}
                adNumber={ad.codigo}
                isVendido={!ad.ativo || ad.pausado}
                onDelete={() => handleDelete(ad.codigo)}
                onEdit={() => handleEdit(ad.codigo)}
                onEditAndPublish={() => handleEditAndPublish(ad.codigo)}
              />
            ))
          ) : (
            <S.EmptyState>
              <S.EmptyStateText>
                {searchTerm || locationFilter 
                  ? 'Nenhum anúncio encontrado com os filtros aplicados.' 
                  : 'Nenhum anúncio de PF encontrado.'
                }
              </S.EmptyStateText>
            </S.EmptyState>
          )}
        </ScrollView>
      </S.ContentContainer>
    </PageScaffold>
  );
};

export default ViewPFAds;
