import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, View, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { AdvertiseStackParamList } from '../types';
import Text from '@components/Text';
import BasicButton from '@components/BasicButton';
import { api } from '@lib/api';

type SelectOptionsNavigationProp = NativeStackNavigationProp<AdvertiseStackParamList, 'selectOptions'>;
type SelectOptionsRouteProp = RouteProp<AdvertiseStackParamList, 'selectOptions'>;

interface OptionItem {
  id: number;
  descricao: string;
}

const SelectOptions = () => {
  const navigation = useNavigation<SelectOptionsNavigationProp>();
  const route = useRoute<SelectOptionsRouteProp>();
  const { selectedOptions, availableOptions, onSelect } = route.params;

  const [selectedItems, setSelectedItems] = useState<string[]>(selectedOptions);
  const [allOptions, setAllOptions] = useState<OptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar opcionais da API ou usar os passados como parâmetro
  useEffect(() => {
    const loadOptions = async () => {
      try {
        // Se availableOptions foi passado, usar eles
        if (availableOptions && availableOptions.length > 0) {
          setAllOptions(availableOptions);
          setIsLoading(false);
          return;
        }

        // Caso contrário, buscar da API
        const response = await api.get('/cliente/listagem/opcionais');
        
        // Se a API retornou com sucesso mas a lista está vazia, usar mock
        if (response.data.status === 'success' && 
            response.data.content.listaOpcionais && 
            response.data.content.listaOpcionais.length > 0) {
          setAllOptions(response.data.content.listaOpcionais);
        } else {
          // Mock de opcionais quando a API retorna vazio
          setAllOptions([
            { id: 1, descricao: 'Alarme' },
            { id: 2, descricao: 'Ar condicionado' },
            { id: 3, descricao: 'Freios ABS' },
            { id: 4, descricao: 'Travas Elétricas' },
            { id: 5, descricao: 'Vidros Elétricos' },
            { id: 6, descricao: 'Ar quente' },
            { id: 7, descricao: 'Banco do motorista com ajuste de altura' },
            { id: 8, descricao: 'Teto solar' },
            { id: 9, descricao: 'Blindado' },
            { id: 10, descricao: 'Câmera de Ré' },
            { id: 11, descricao: 'Bancos de Couro' },
            { id: 12, descricao: 'CD / MP3' },
            { id: 13, descricao: 'Central multimídia' },
            { id: 14, descricao: 'Computador de bordo' },
            { id: 15, descricao: 'Controle de estabilidade' },
            { id: 16, descricao: 'Controle de tração' },
            { id: 17, descricao: 'Conversível' },
            { id: 18, descricao: 'Desembaçador' },
            { id: 19, descricao: 'Direção Elétrica' },
            { id: 20, descricao: 'Direção Hidráulica' },
            { id: 21, descricao: 'DVD' },
            { id: 22, descricao: 'EBD' },
            { id: 23, descricao: 'Faróis Auxiliares' },
            { id: 24, descricao: 'Faróis LED' },
            { id: 25, descricao: 'Farol Xenônio' },
            { id: 26, descricao: 'GPS' },
            { id: 27, descricao: 'Limpador traseiro' },
            { id: 28, descricao: 'USB' },
            { id: 29, descricao: 'Piloto automático' },
            { id: 30, descricao: 'Retrovisores Elétricos' },
            { id: 31, descricao: 'Rodas de Liga Leve' },
            { id: 32, descricao: 'Sensor de Estacionamento' },
            { id: 33, descricao: 'Tração 4x4' },
            { id: 34, descricao: 'Turbo' },
            { id: 35, descricao: 'Volante ajustável' },
            { id: 36, descricao: 'Volante com multimídia' },
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar opcionais:', error);
        // Fallback em caso de erro na requisição
        setAllOptions([
          { id: 1, descricao: 'Alarme' },
          { id: 2, descricao: 'Ar condicionado' },
          { id: 3, descricao: 'Freios ABS' },
          { id: 4, descricao: 'Travas Elétricas' },
          { id: 5, descricao: 'Vidros Elétricos' },
          { id: 6, descricao: 'Ar quente' },
          { id: 7, descricao: 'Banco do motorista com ajuste de altura' },
          { id: 8, descricao: 'Teto solar' },
          { id: 9, descricao: 'Blindado' },
          { id: 10, descricao: 'Câmera de Ré' },
          { id: 11, descricao: 'Bancos de Couro' },
          { id: 12, descricao: 'CD / MP3' },
          { id: 13, descricao: 'Central multimídia' },
          { id: 14, descricao: 'Computador de bordo' },
          { id: 15, descricao: 'Controle de estabilidade' },
          { id: 16, descricao: 'Controle de tração' },
          { id: 17, descricao: 'Conversível' },
          { id: 18, descricao: 'Desembaçador' },
          { id: 19, descricao: 'Direção Elétrica' },
          { id: 20, descricao: 'Direção Hidráulica' },
          { id: 21, descricao: 'DVD' },
          { id: 22, descricao: 'EBD' },
          { id: 23, descricao: 'Faróis Auxiliares' },
          { id: 24, descricao: 'Faróis LED' },
          { id: 25, descricao: 'Farol Xenônio' },
          { id: 26, descricao: 'GPS' },
          { id: 27, descricao: 'Limpador traseiro' },
          { id: 28, descricao: 'USB' },
          { id: 29, descricao: 'Piloto automático' },
          { id: 30, descricao: 'Retrovisores Elétricos' },
          { id: 31, descricao: 'Rodas de Liga Leve' },
          { id: 32, descricao: 'Sensor de Estacionamento' },
          { id: 33, descricao: 'Tração 4x4' },
          { id: 34, descricao: 'Turbo' },
          { id: 35, descricao: 'Volante ajustável' },
          { id: 36, descricao: 'Volante com multimídia' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, [availableOptions]);

  const handleToggleOption = (option: string) => {
    setSelectedItems(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleContinue = () => {
    onSelect(selectedItems);
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingLeft: 30, paddingTop: 21, paddingBottom: 13, borderBottomColor: '#EBE8D9', borderBottomWidth: 1 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
        >
          <Image source={require('@icons/arrow.png')} />
          <Text color="black" fontStyle="p-16-bold">
            Selecione uma opção
          </Text>
        </Pressable>
      </View>

      <ScrollView 
        style={{ flex: 1, paddingHorizontal: 30, paddingVertical: 20 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
            <Text fontStyle="p-14-regular" color="gray-500">Carregando opcionais...</Text>
          </View>
        ) : (
          allOptions.map((option, index) => (
            <View 
              key={option.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#F1F4F9',
              }}
              onTouchEnd={() => handleToggleOption(option.descricao)}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: '#E11138',
                    backgroundColor: selectedItems.includes(option.descricao) ? '#E11138' : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  {selectedItems.includes(option.descricao) && (
                    <Text color="white" fontStyle="c-12-bold">✓</Text>
                  )}
                </TouchableOpacity>
                <Text 
                  color="black" 
                  fontStyle="p-14-regular"
                  style={{ flex: 1, flexWrap: 'wrap' }}
                >
                  {option.descricao}
                </Text>
              </View>
              <Text color="black" fontStyle="p-16-regular" style={{ marginLeft: 8 }}>›</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Botão flutuante fixo na parte inferior */}
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
        />
      </View>
    </View>
  );
};

export default SelectOptions;
