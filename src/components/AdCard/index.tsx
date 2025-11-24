import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { NoPhotoIcon, FullscreenIcon } from '@components/CustomIcons';
import Text from '@components/Text';
import BasicButton from '@components/BasicButton';
import * as S from './styles';

export interface AdCardProps {
  id: string;
  brand: string;
  model: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  createdAt: string;
  adNumber: string;
  isVendido?: boolean;
  onViewImages?: () => void;
  onEdit?: () => void;
  onResume?: () => void;
  onMarkSold?: () => void;
  showMarkSold?: boolean;
}

const AdCard: React.FC<AdCardProps> = ({
  id,
  brand,
  model,
  description,
  imageUrl,
  images,
  createdAt,
  adNumber,
  isVendido = false,
  onViewImages,
  onEdit,
  onResume,
  onMarkSold,
  showMarkSold = true,
}) => {
  return (
    <S.Container>
      <S.ImageContainer>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={{ 
              width: '100%', 
              height: '100%' 
            }} 
            resizeMode="cover"
          />
        ) : (
          <View style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#F0F0F0',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <NoPhotoIcon size={40} color="#999" />
            <Text fontStyle="c-12-regular" color="gray-500" style={{ marginTop: 8 }}>
              Sem imagem
            </Text>
          </View>
        )}

        {isVendido && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: '#CE2020',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
              borderWidth: 3,
              borderColor: 'white',
              transform: [{ rotate: '-15deg' }],
            }}>
              <Text 
                fontStyle="p-18-bold" 
                color="white"
                style={{ 
                  fontSize: 24, 
                  fontWeight: 'bold',
                  letterSpacing: 2,
                }}
              >
                VENDIDO
              </Text>
            </View>
          </View>
        )}

        {images && images.length > 0 && (
          <TouchableOpacity style={S.viewIcon} onPress={onViewImages}>
            <FullscreenIcon size={16} color="#666" />
          </TouchableOpacity>
        )}
      </S.ImageContainer>

      <S.ContentContainer>
        <S.VehicleInfo>
          <Text fontStyle="p-16-bold" color="black">
            {brand} {model}
          </Text>
          <Text fontStyle="p-14-regular" color="black">
            {description}
          </Text>
        </S.VehicleInfo>
        <S.AdInfo>
          <Text fontStyle="c-12-regular" color="black-200">
            Criado em {createdAt}
          </Text>
          <Text fontStyle="c-12-regular" color="black-200">
            Anúncio nº {adNumber}
          </Text>
        </S.AdInfo>

        <S.ButtonsContainer>
          <BasicButton
            label="Retomar Anúncio"
            width={showMarkSold ? '50%' : '100%'}
            onPress={() => onResume?.()}
            backgroundColor="#CE7720"
            color="white"
            customStyles={{ paddingHorizontal: 0 }}
          />
          {showMarkSold && (
            <BasicButton
              label={isVendido ? "Já Vendido" : "Veículo Vendido"}
              width='50%'
              onPress={() => onMarkSold?.()}
              backgroundColor="#CE2020"
              color="white"
              customStyles={{ paddingHorizontal: 0 }}
              disabled={isVendido}
            />
          )}
        </S.ButtonsContainer>
      </S.ContentContainer>
    </S.Container>
  );
};

export default AdCard;
