import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { NoPhotoIcon, DeleteIcon, SettingsIcon } from '@components/CustomIcons';
import Text from '@components/Text';
import BasicButton from '@components/BasicButton';
import * as S from './styles';

export interface AdCardPFProps {
  id: string;
  brand: string;
  model: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  adNumber: string;
  isVendido?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onEditAndPublish?: () => void;
}

const AdCardPF: React.FC<AdCardPFProps> = ({
  id,
  brand,
  model,
  description,
  imageUrl,
  createdAt,
  adNumber,
  isVendido = false,
  onDelete,
  onEdit,
  onEditAndPublish,
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
        
        {/* Carimbo de VENDIDO */}
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
        
        {/* Ícone de deletar */}
        <TouchableOpacity style={S.deleteIcon} onPress={onDelete}>
          <DeleteIcon size={20} color="#666" />
        </TouchableOpacity>
        
        {/* Ícone de editar */}
        <TouchableOpacity style={S.editIcon} onPress={onEdit}>
          <SettingsIcon size={16} color="#666" />
        </TouchableOpacity>
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

        <S.ButtonContainer>
          <BasicButton
            label={isVendido ? "Anúncio Vendido" : "Editar e Publicar Anúncio"}
            onPress={() => onEditAndPublish?.()}
            backgroundColor="#CE7720"
            color="white"
            width="100%"
            customStyles={{ paddingHorizontal: 16 }}
            disabled={isVendido}
          />
        </S.ButtonContainer>
      </S.ContentContainer>
    </S.Container>
  );
};

export default AdCardPF;
