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


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ItemCardProps {
  itemID: number;
  imageUrl: string;
  brand: string;
  model: string;
  price: string;
  fipePrice: string;
  storeName: string;
  description: string;
  itemPerRow?: number;
}

const ItemCard = ({
  imageUrl,
  brand,
  model,
  price,
  fipePrice,
  itemID,
  description,
  storeName,
  itemPerRow = 1,
}: ItemCardProps) => {
  const navigation = useNavigation<NavigationProp>();
  const seeOffer = () => {
    navigation.navigate('adDetails', { code: itemID.toString() });
  };

  return (
    <I.ItemCardContainer
      style={{ width: itemPerRow === 1 ? '100%' : '50%' }}
    >
      <TouchableOpacity onPress={seeOffer}>
        <I.ItemCardImage
          source={imageUrl}
          contentFit="cover"
          cachePolicy="memory-disk"
          style={{ height: itemPerRow === 1 ? 200 : 120}}
        />
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
