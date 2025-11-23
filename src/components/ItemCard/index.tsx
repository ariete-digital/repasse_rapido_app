import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import * as I from './styles';
import Text from '@components/Text';
import {
  useNavigation,
} from '@react-navigation/native';
import { currencyFormat } from '@utils/index';
import { SvgXml } from 'react-native-svg';
import { StarGoldIcon } from '@icons/StarGoldIcon';
import BasicButton from '@components/BasicButton';
import {
  RootStackParamList,
} from '@routes/app.routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NoPhotoIcon } from '@components/CustomIcons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ItemCardProps {
  itemID: number;
  codigo?: string; 
  imageUrl?: string;
  brand: string;
  model: string;
  price: string;
  fipePrice: string;
  storeName: string;
  description: string;
  itemPerRow?: number;
  isVendido?: boolean;
}

const ItemCard = ({
  imageUrl,
  brand,
  model,
  price,
  fipePrice,
  itemID,
  codigo,
  description,
  storeName,
  itemPerRow = 1,
  isVendido = false,
}: ItemCardProps) => {
  const navigation = useNavigation<NavigationProp>();
  const seeOffer = () => {
    
    const codeToUse = codigo || itemID.toString();
    navigation.navigate('adDetails', { code: codeToUse });
  };

  return (
    <I.ItemCardContainer
      style={{ width: itemPerRow === 1 ? '100%' : '50%' }}
    >
      <TouchableOpacity onPress={seeOffer} style={{ position: 'relative' }}>
        {imageUrl ? (
          <I.ItemCardImage
            source={imageUrl}
            contentFit="cover"
            cachePolicy="memory-disk"
            style={{ height: itemPerRow === 1 ? 200 : 120}}
          />
        ) : (
          <View style={{
            height: itemPerRow === 1 ? 200 : 120,
            backgroundColor: '#E0E0E0',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <NoPhotoIcon size={itemPerRow === 1 ? 60 : 40} color="#9E9E9E" />
            <Text color="black-500" fontStyle={itemPerRow === 1 ? "p-14-bold" : "c-12-regular"}>
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
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 3,
              borderColor: 'white',
              transform: [{ rotate: '-15deg' }],
            }}>
              <Text 
                fontStyle="p-18-bold" 
                color="white"
                style={{ 
                  fontSize: itemPerRow === 1 ? 20 : 16, 
                  fontWeight: 'bold',
                  letterSpacing: 2,
                }}
              >
                VENDIDO
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
      <I.ItemCardTitleContainer>
        <Text
          color="black-400"
          fontStyle={itemPerRow === 1 ? "t-24" : "p-18-regular"}
          spacingY={6}
        >{`${brand} ${model}`}</Text>
        <Text 
          color="black-700" 
          fontStyle={itemPerRow === 1 ? "p-18-regular" : "c-12-regular"}
          spacingY={6}
        >
          {description}
        </Text>
        <Text 
          color="brand-red" 
          spacingX={4} 
          spacingY={7} 
          fontStyle={itemPerRow === 1 ? "t-32" : "p-18-regular"}
        >
          {currencyFormat(price)}
        </Text>
        <View 
          style={{ display: 'flex', flexDirection: 'row', gap: 4 }}
        >
          <Text 
            color="black-500" 
            fontStyle={itemPerRow === 1 ? "p-18-medium" : "c-12-medium"}
            spacingY={6}
          >
            Valor
          </Text>
          <Text 
            color="orange-text" 
            fontStyle={itemPerRow === 1 ? "p-18-medium" : "c-12-medium"}
            spacingY={6}
          >
            FIPE {currencyFormat(fipePrice)}
          </Text>
        </View>
        <View  
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <SvgXml 
            xml={StarGoldIcon()} 
            width={itemPerRow === 1 ? 24 : 16} 
            height={itemPerRow === 1 ? 24 : 16} 
          />
          <Text 
            color="black-500" 
            fontStyle={itemPerRow === 1 ? "p-18-regular" : "c-12-regular"}
            spacingY={6}
          >
            {storeName}
          </Text>
        </View>
        <I.ButtonRow>
          <BasicButton
            label="VER ANÚNCIO"
            onPress={seeOffer}
            backgroundColor='#E11138'
            color='white'
          />
        </I.ButtonRow>
      </I.ItemCardTitleContainer>
    </I.ItemCardContainer>
  );
};

export default ItemCard;
