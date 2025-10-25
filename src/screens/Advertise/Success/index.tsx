import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Image } from 'react-native';
import { AdvertiseStackParamList } from '../types';
import { HeaderLogo, Text } from '@components/index';
import BasicButton from '@components/BasicButton';
import * as S from './styles';

type SuccessNavigationProp = NativeStackNavigationProp<AdvertiseStackParamList, 'advertiseSuccess'>;
type SuccessRouteProp = RouteProp<AdvertiseStackParamList, 'advertiseSuccess'>;

const Success = () => {
  const navigation = useNavigation<SuccessNavigationProp>();
  const route = useRoute<SuccessRouteProp>();
  const { adNumber, isEditing } = route.params;

  return (
    <S.Container>
      <View 
        style={{
          marginTop: 70,
          marginBottom: 70
        }}
      >
        <HeaderLogo />
      </View>
      
      <Image source={require('@images/blueCircleCheckmark.png')} />
      
      <View>
        <Text color="brand-red-dark" fontStyle="t-24" align='center'>
          Anúncio nº {adNumber} {isEditing ? 'atualizado' : 'cadastrado'} com sucesso!
        </Text>
      </View>
      
      <View
        style={{
          alignItems: "center",
          flex: 1,
          width: "100%",
          marginTop: 30,
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <BasicButton
          label="Voltar"
          onPress={() => navigation.navigate('advertiseHome')}
          backgroundColor='#9A0B26'
          color='white'
        />
      </View>
    </S.Container>
  );
};

export default Success;
