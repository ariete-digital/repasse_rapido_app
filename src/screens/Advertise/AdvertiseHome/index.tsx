import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdvertiseStackParamList } from '../types';
import { CarIcon } from '@icons/CarIcon';
import PageScaffold from '@components/PageScaffold';
import { SvgXml } from 'react-native-svg';
import Text from '@components/Text';
import BasicButton from '@components/BasicButton';
import { useAdvertise } from '../context/AdvertiseContext';

type AdvertiseScreenNavigationProp = NativeStackNavigationProp<AdvertiseStackParamList, 'advertiseHome'>;
type AdvertiseHomeRouteProp = RouteProp<AdvertiseStackParamList, 'advertiseHome'>;

const AdvertiseHome = () => {
  const navigation = useNavigation<AdvertiseScreenNavigationProp>();
  const route = useRoute<AdvertiseHomeRouteProp>();
  const { loadAdDataForEdit, clearAdvertiseData } = useAdvertise();
  const [isLoadingAd, setIsLoadingAd] = useState(false);

  const editCodigo = (route.params as any)?.editCodigo;

  useEffect(() => {
    const loadAdForEdit = async () => {
      if (editCodigo) {
        try {
          setIsLoadingAd(true);
          await loadAdDataForEdit(editCodigo);
          
          navigation.navigate('advertiseStep1');
        } catch (error) {
          Alert.alert(
            'Erro',
            'Não foi possível carregar os dados do anúncio. Tente novamente.',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack()
              }
            ]
          );
        } finally {
          setIsLoadingAd(false);
        }
      }
    };

    loadAdForEdit();
  }, [editCodigo]);

  const handleStartAd = () => {
    
    clearAdvertiseData();
    navigation.navigate('advertiseStep1');
  };

  if (isLoadingAd) {
    return (
      <PageScaffold
        titleText={'Carregando anúncio'}
        titleIcon={<SvgXml xml={CarIcon()} width={20} height={20} />}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <ActivityIndicator size="large" color="#9A0B26" />
          <Text fontStyle="p-14-regular" color="gray-500" style={{ marginTop: 16 }}>
            Carregando dados do anúncio...
          </Text>
        </View>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold
      titleText={'Anunciar meu veículo'}
      titleIcon={<SvgXml xml={CarIcon()} width={20} height={20} />}
    >
      <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 40, paddingVertical: 80, gap: 60 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
          <Text fontStyle="p-18-bold" color="gray-500" align='center'>
            Venda com segurança e praticidade!
          </Text>
          <Text fontStyle="p-16-regular" color="gray-500" align='center'>
            Anuncie agora e alcance muitos possíveis compradores!
          </Text>
        </View>
        <BasicButton
          label="Iniciar Anúncio"
          onPress={handleStartAd}
          backgroundColor='#9A0B26'
          color='white'
        />
      </View>
    </PageScaffold>
  );
};

export default AdvertiseHome;
