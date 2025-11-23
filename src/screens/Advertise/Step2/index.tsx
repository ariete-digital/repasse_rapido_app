import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdvertiseStackParamList } from '../types';
import PageScaffold from '@components/PageScaffold';
import { SvgXml } from 'react-native-svg';
import { CarIcon } from '@icons/CarIcon';
import BasicButton from '@components/BasicButton';
import { Text, ProgressSteps } from '@components/index';
import { useAdvertise } from '../context/AdvertiseContext';

type Step2NavigationProp = NativeStackNavigationProp<AdvertiseStackParamList, 'advertiseStep2'>;

interface OptionItem {
  id: number;
  descricao: string;
}

const Step2 = () => {
  const navigation = useNavigation<Step2NavigationProp>();
  const { updateStep2Data, parameters, advertiseData } = useAdvertise();

  const [selectedOptionalIds, setSelectedOptionalIds] = useState<number[]>([]);

  useEffect(() => {
    
    if ((advertiseData.id || advertiseData.opcionais) && advertiseData.opcionais && advertiseData.opcionais.length > 0) {
      setSelectedOptionalIds(advertiseData.opcionais);
    }
  }, [advertiseData.id, advertiseData.opcionais]);

  const availableOptions = parameters.opcionais;

  const selectedOptionals = availableOptions.filter(option => 
    selectedOptionalIds.includes(option.id)
  );

  const handleSelectOptions = () => {
    navigation.navigate('selectOptions', {
      selectedOptions: selectedOptionals.map(opt => opt.descricao),
      availableOptions: availableOptions,
      onSelect: (selectedDescriptions: string[]) => {
        
        const ids = availableOptions
          .filter(opt => selectedDescriptions.includes(opt.descricao))
          .map(opt => opt.id);
        setSelectedOptionalIds(ids);
      },
    });
  };

  const isEditing = !!advertiseData.id;

  const handleContinue = () => {

    updateStep2Data({
      opcionais: selectedOptionalIds,
    });
    
    navigation.navigate('advertiseStep3');
  };

  const handleToggleOptional = (optionalId: number) => {
    setSelectedOptionalIds(prev => {
      if (prev.includes(optionalId)) {
        return prev.filter(id => id !== optionalId);
      } else {
        return [...prev, optionalId];
      }
    });
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
          />
        </View>
      }
    >
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <ProgressSteps currentStep={2} />
        </View>

        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <Text fontStyle="p-16-bold" color="gray-500" style={{marginBottom: 30}}>
            Marque os opcionais do seu veículo:
          </Text>

          <TouchableOpacity 
            onPress={handleSelectOptions}
            style={{
              backgroundColor: '#F1F4F9',
              borderRadius: 8,
              padding: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text fontStyle="p-14-regular" color="gray-500">
              {selectedOptionalIds.length > 0 
                ? `${selectedOptionalIds.length} itens selecionados`
                : 'Selecionar opcionais'
              }
            </Text>
            
            <Text fontStyle="p-14-bold" color="gray-500">+</Text>
          </TouchableOpacity>

          {selectedOptionals.length > 0 && (
            <View>
              {selectedOptionals.map((optional) => (
                <View 
                  key={optional.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F1F4F9',
                  }}
                  onTouchEnd={() => handleToggleOptional(optional.id)}
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
                        backgroundColor: selectedOptionalIds.includes(optional.id) ? '#E11138' : 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                      }}
                    >
                      {selectedOptionalIds.includes(optional.id) && (
                        <Text color="white" fontStyle="c-12-bold">✓</Text>
                      )}
                    </TouchableOpacity>
                    <Text 
                      color="black" 
                      fontStyle="p-14-regular"
                      style={{ flex: 1, flexWrap: 'wrap' }}
                    >
                      {optional.descricao}
                    </Text>
                  </View>
                  <Text color="black" fontStyle="p-16-regular" style={{ marginLeft: 8 }}>›</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </PageScaffold>
  );
};

export default Step2;
