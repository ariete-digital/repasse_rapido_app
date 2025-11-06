import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdvertiseStackParamList } from '../types';
import ProgressSteps from '@components/ProgressSteps';
import PageScaffold from '@components/PageScaffold';
import { SvgXml } from 'react-native-svg';
import { CarIcon } from '@icons/CarIcon';
import { useAdvertise } from '../context/AdvertiseContext';
import { Text } from '@components/index';
import BasicButton from '@components/BasicButton';

type Step5NavigationProp = NativeStackNavigationProp<AdvertiseStackParamList, 'advertiseStep5'>;

const Step5 = () => {
  const navigation = useNavigation<Step5NavigationProp>();
  const { updateStep5Data, advertiseData } = useAdvertise();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Função para formatar valor para exibição (retorna "35.000,00")
  const formatPriceForDisplay = (value: string) => {
    if (!value) return '';
    // Se o valor está em formato "35000.00", converter para "35.000,00"
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return value;
    
    return numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Preencher campos se estiver editando
  useEffect(() => {
    if (advertiseData.id || advertiseData.descricao || advertiseData.valor) {
      if (advertiseData.descricao) setDescription(advertiseData.descricao);
      if (advertiseData.valor) setPrice(formatPriceForDisplay(advertiseData.valor));
      if (advertiseData.aceite_termos === '1' || advertiseData.aceite_termos === 'true') setAgreeTerms(true);
    }
  }, [advertiseData.id, advertiseData.descricao, advertiseData.valor]);

  // Função para formatar o preço com máscara (exibição)
  const formatPrice = (text: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = text.replace(/\D/g, '');
    
    if (numericValue === '') {
      return '';
    }
    
    // Converte para número e divide por 100 para obter os centavos
    const value = parseInt(numericValue) / 100;
    
    // Formata como moeda brasileira (ex: "1.234,56")
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para converter preço formatado para formato da API
  const convertPriceToAPI = (formattedPrice: string) => {
    // Remove pontos e substitui vírgula por ponto
    // "35.000,00" -> "35000.00"
    return formattedPrice.replace(/\./g, '').replace(',', '.');
  };

  // Função para lidar com a mudança do texto do preço
  const handlePriceChange = (text: string) => {
    const formattedPrice = formatPrice(text);
    setPrice(formattedPrice);
  };

  // Validar se todos os campos obrigatórios estão preenchidos
  const isFormValid = description.trim() !== '' && price !== '' && agreeTerms;

  const isEditing = !!advertiseData.id;

  const handleContinue = () => {
    if (!agreeTerms) {
      return;
    }

    // Preparar dados para a API
    const step5Data = {
      descricao: description,
      valor: convertPriceToAPI(price), // Converte para formato da API (35000.00)
      aceite_termos: "true" // Backend espera string "true"
    };

    
    // Salvar dados no contexto
    updateStep5Data(step5Data);
    
    navigation.navigate('advertiseStep6', { step5Data });
  };

  return (
    <PageScaffold
      titleText={isEditing ? 'Editar meu anúncio' : 'Anunciar meu veículo'}
      titleIcon={<SvgXml xml={CarIcon()} width={20} height={20} />}
      floatingButton={
        <View style={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          paddingHorizontal: 30,
          paddingVertical: 10,
        }}>
          <BasicButton
            label="Continuar"
            onPress={handleContinue}
            backgroundColor='#9A0B26'
            color='white'
            disabled={!isFormValid}
          />
        </View>
      }
    >
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <ProgressSteps currentStep={5} />
        </View>

        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <Text fontStyle="p-16-bold" color="gray-500" style={{marginBottom: 30}}>
            Valor e descrição do veículo
          </Text>


            <Text color="orange-text" style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left', lineHeight: 18, marginBottom: 20 }}>IMPORTANTE:
               <Text color="black" style={{ fontSize: 14, color: 'black', textAlign: 'left', lineHeight: 18 }}> O valor do veículo deve ser no mínimo 20% abaixo do valor da tabela FIPE. Consulte o valor do seu veículo na FIPE aqui!</Text>
            </Text>


          <Text color="black" style={{ fontSize: 14, color: 'black', textAlign: 'left', lineHeight: 18, marginBottom: 20 }}>
            Faça um breve relato sobre seu veículo, cite os detalhes, defeitos ocultos ou acessórios que não estão funcionando perfeitamente (não omita nada) pois isso interfere na negociação e a omissão pode acarretar na desistência por parte do comprador no ato da entrega do veículo se algo não informado for detectado. Todos os itens serão conferidos.
          </Text>

          <View style={{ marginBottom: 20 }}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Digite a descrição do seu veículo..."
              multiline
              numberOfLines={6}
              style={{
                backgroundColor: '#F1F4F9',
                borderRadius: 8,
                padding: 12,
                fontSize: 14,
                color: 'black',
                minHeight: 120,
                textAlignVertical: 'top',
              }}
            />
          </View>

          <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginBottom: 20, gap: 8 }}>
            <Text color="black" style={{ fontSize: 14, fontWeight: '500', textAlign: 'left', color: 'black', marginRight: 8 }}>
              Por qual valor deseja vender seu veículo?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <Text color="black" style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left', color: 'black', marginRight: 8 }}>R$</Text>
              <TextInput
                value={price}
                onChangeText={handlePriceChange}
                placeholder="0,00"
                keyboardType="numeric"
                style={{
                  backgroundColor: '#F1F4F9',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  color: 'black',
                  flex: 1,
                }}
              />
            </View>
          </View>

          <Text color="black" style={{ fontSize: 14, color: 'black', textAlign: 'left', lineHeight: 18, marginBottom: 20 }}>
            Declaro que todas as informações acima são verdadeiras e as fotos são verdadeiramente do veículo que pretendo vender.
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, gap: 8 }}>
            <TouchableOpacity
              onPress={() => setAgreeTerms(!agreeTerms)}
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: '#E11138',
                backgroundColor: agreeTerms ? '#E11138' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                marginTop: 2,
              }}
            >
              {agreeTerms && (
                <Text color="white" style={{ fontSize: 12, fontWeight: 'bold' }}>✓</Text>
              )}
            </TouchableOpacity>
            <Text color="black" style={{ flex: 1, fontSize: 14, color: 'black', lineHeight: 20 }}>
              Li e concordo com os termos acima.
            </Text>
          </View>
        </View>
      </View>
    </PageScaffold>
  );
};

export default Step5;
