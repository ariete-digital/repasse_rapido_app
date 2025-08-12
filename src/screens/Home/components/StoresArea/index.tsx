import { useEffect, useState } from 'react';
import { Pressable, SafeImage, StoreLogo, StoreLogos } from './styles';
import Text from '@components/Text';
import { Alert, Image, Linking, TouchableOpacity, View } from 'react-native';
import { Store } from '@screens/Home/types';
import { api } from '@lib/api';
import { AxiosResponse } from 'axios';
import { DataFetchProps } from '@lib/types';
import { canOpenURL, openUrl } from '@utils/index';
import GradientButton from '@components/GradientButton';

export const StoresArea = () => {
  const [stores, setStores] = useState<Store[]>([]);

  const getStores = async () => {
    const response: AxiosResponse<DataFetchProps> =
      await api.get<DataFetchProps>('/cliente/get_logos_lojas');
    // console.log('response.data.content.lojas =', response.data.content.lojas);
    if (Array.isArray(response.data.content.lojas)) {
      setStores(response.data.content.lojas);
      return;
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  const handlePress = async (url: string) => {
    try {
      const supported = await canOpenURL(url);
      if (supported) {
        await openUrl(url);
      } else {
        Alert.alert(`Não foi possível abrir a URL: ${url}`);
      }
    } catch (error) {
      console.error('Erro ao abrir URL:', error);
      Alert.alert('Erro ao tentar abrir o link.');
    }
  };

  const countHasLogo = stores.filter(
    (item) =>
      item.imagem_logo !== undefined &&
      item.imagem_logo !== null &&
      item.imagem_logo !== ''
  ).length;
  if (countHasLogo === 0) {
    return <View style={{ margin: 1 }} />;
  }

  return (
    <>
      <Text color="black-700" fontStyle="t-24" spacingY={16} spacingX={10}>
        Lojistas
      </Text>
      <StoreLogos>
        {stores.map(
          (store, index) =>
            store.imagem_logo &&
            index <= 5 && (
              <Pressable
                key={store.id}
                onPress={() =>
                  handlePress(`https://repasserapido.com.br/lojas/${store.slug}`)
                }
              >
                <SafeImage
                  uri={store.imagem_logo}
                  style={{ width: 100, height: 100, margin: 10 }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                />
              </Pressable>
            )
        )}
      </StoreLogos>
      <View
        style={{
          marginBottom: 16,
          marginHorizontal: 10,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <GradientButton
          label="Ver todas as lojas"
          onPress={() => openUrl('https://repasserapido.com.br/lojas')}
        />
      </View>
    </>
  );
};
