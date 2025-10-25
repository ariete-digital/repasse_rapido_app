import React from 'react';
import { ScrollView, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { EyeIcon } from '@icons/EyeIcon';
import PageScaffold from '@components/PageScaffold';
import AdCardPF from '@components/AdCardPF';
import SearchFilters from '@components/SearchFilters';
import * as S from './styles';

// Mock data - em produção viria de uma API
const mockPFAds = [
  {
    id: '1',
    brand: 'Hyundai',
    model: 'HB20',
    description: '1.0 Comfort Style (Flex)',
    imageUrl: 'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1',
    createdAt: '10/06/2025',
    adNumber: '123456',
  },
  {
    id: '2',
    brand: 'Hyundai',
    model: 'HB20',
    description: '1.0 Comfort Style (Flex)',
    imageUrl: 'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1',
    createdAt: '10/06/2025',
    adNumber: '123457',
  },
  {
    id: '3',
    brand: 'Hyundai',
    model: 'HB20',
    description: '1.0 Comfort Style (Flex)',
    imageUrl: 'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1',
    createdAt: '10/06/2025',
    adNumber: '123458',
  },
];

const ViewPFAds = () => {
  const handleDelete = (adId: string) => {
    console.log('Deletar anúncio PF:', adId);
    // Implementar lógica de exclusão
  };

  const handleEdit = (adId: string) => {
    console.log('Editar anúncio PF:', adId);
    // Implementar lógica de edição
  };

  const handleEditAndPublish = (adId: string) => {
    console.log('Editar e publicar anúncio PF:', adId);
    // Implementar lógica de editar e publicar
  };

  const handleAdNumberSearch = (value: string) => {
    console.log('Buscar por número:', value);
    // Implementar lógica de busca
  };

  const handleLocationChange = (value: string) => {
    console.log('Filtrar por localização:', value);
    // Implementar lógica de filtro
  };

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
          {mockPFAds.length > 0 ? (
            mockPFAds.map((ad) => (
              <AdCardPF
                key={ad.id}
                id={ad.id}
                brand={ad.brand}
                model={ad.model}
                description={ad.description}
                imageUrl={ad.imageUrl}
                createdAt={ad.createdAt}
                adNumber={ad.adNumber}
                onDelete={() => handleDelete(ad.id)}
                onEdit={() => handleEdit(ad.id)}
                onEditAndPublish={() => handleEditAndPublish(ad.id)}
              />
            ))
          ) : (
            <S.EmptyState>
              <S.EmptyStateText>
                Nenhum anúncio de PF encontrado.
              </S.EmptyStateText>
            </S.EmptyState>
          )}
        </ScrollView>
      </S.ContentContainer>
    </PageScaffold>
  );
};

export default ViewPFAds;
