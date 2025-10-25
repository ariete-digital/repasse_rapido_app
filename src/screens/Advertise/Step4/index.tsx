import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdvertiseStackParamList } from '../types';
import ProgressSteps from '@components/ProgressSteps';
import PageScaffold from '@components/PageScaffold';
import { SvgXml } from 'react-native-svg';
import { CarIcon } from '@icons/CarIcon';
import { useAdvertise } from '../context/AdvertiseContext';
import { Text } from '@components/index';
import * as ImagePicker from 'expo-image-picker';
import BasicButton from '@components/BasicButton';

type Step4NavigationProp = NativeStackNavigationProp<AdvertiseStackParamList, 'advertiseStep4'>;

interface Photo {
  uri: string;
  base64: string;
  index: number;
}

const Step4 = () => {
  const navigation = useNavigation<Step4NavigationProp>();
  const { updateStep4Data, advertiseData } = useAdvertise();
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Preencher fotos se estiver editando
  useEffect(() => {
    if (advertiseData.id_anuncio && advertiseData.imagens) {
      console.log('Step4 - Loading images for edit:', advertiseData.imagens.length);
      const loadedPhotos = advertiseData.imagens.map((img: any, idx: number) => ({
        uri: img.uri || img.url, // Pode vir como uri ou url da API
        base64: img.base64 || '', // Imagens da API não terão base64 inicialmente
        index: idx,
      }));
      setPhotos(loadedPhotos);
    }
  }, [advertiseData.id_anuncio]);

  const pickImage = async (index: number) => {
    // Solicitar permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de permissão para acessar suas fotos.'
      );
      return;
    }

    // Abrir seletor de imagens
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true, // Retorna base64
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      
      if (!asset.base64) {
        Alert.alert('Erro', 'Não foi possível obter a imagem em base64');
        return;
      }

      const newPhoto: Photo = {
        uri: asset.uri,
        base64: asset.base64,
        index: index,
      };

      // Verificar se já existe uma foto neste índice
      const existingPhotoIndex = photos.findIndex(p => p.index === index);
      
      if (existingPhotoIndex >= 0) {
        // Substituir foto existente
        const updatedPhotos = [...photos];
        updatedPhotos[existingPhotoIndex] = newPhoto;
        setPhotos(updatedPhotos);
      } else {
        // Adicionar nova foto
        setPhotos(prev => [...prev, newPhoto]);
      }
    }
  };

  const handleAddPhoto = (index: number) => {
    pickImage(index);
  };

  const isEditing = !!advertiseData.id_anuncio;

  const handleContinue = () => {
    // Preparar dados das imagens para a API
    const imageData = prepareImagesForAPI();
    console.log('Step4 - Submitting images:', imageData);
    
    // Salvar dados no contexto
    updateStep4Data({
      imagens: imageData,
    });
    
    navigation.navigate('advertiseStep5', { images: imageData });
  };

  const prepareImagesForAPI = () => {
    // Ordenar fotos por índice para garantir ordem correta
    const sortedPhotos = [...photos].sort((a, b) => a.index - b.index);
    
    // Filtrar apenas fotos que têm base64 (novas fotos selecionadas)
    const photosWithBase64 = sortedPhotos.filter(photo => photo.base64);
    
    // Retornar array de base64 com metadados
    const imagesArray = photosWithBase64.map((photo, arrayIndex) => ({
      uri: photo.uri, // Incluir URI também
      base64: photo.base64,
      name: `image_${photo.index}.jpg`,
      type: 'image/jpeg',
      principal: arrayIndex === 0, // O primeiro é sempre a imagem principal
      index: photo.index
    }));

    return imagesArray;
  };

  const getPhotoByIndex = (index: number) => {
    return photos.find(p => p.index === index);
  };

  const renderPhotoSlot = (index: number, style: any) => {
    const photo = getPhotoByIndex(index);

    return (
      <TouchableOpacity 
        key={`photo-${index}`}
        onPress={() => handleAddPhoto(index)}
        style={[
          {
            backgroundColor: '#F1F4F9',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            // Sombra para iOS
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            // Sombra para Android
            elevation: 3,
          },
          style
        ]}
      >
        {photo ? (
          <Image 
            source={{ uri: photo.uri }} 
            style={{ 
              width: '100%', 
              height: '100%',
              borderRadius: 8,
            }} 
            resizeMode="cover"
          />
        ) : (
          <>
            <Text color="black" style={{ fontSize: 24, fontWeight: 'bold' }}>+</Text>
            <Text color="black" style={{ fontSize: 12, marginTop: 4 }}>Adicionar</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  console.log(photos);

  const renderPhotoGrid = () => {    
    return (
      <View style={{ 
        display: 'flex',
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        gap: 10,
      }}>
        {/* Foto principal grande */}
        {renderPhotoSlot(0, {
          width: '64%',
          minHeight: 180,
          aspectRatio: 1,
        })}
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            marginLeft: 10,
            minHeight: 180,
          }}
        >
          {/* Duas fotos pequenas ao lado da grande */}
          {renderPhotoSlot(1, {
            flex: 1,
            minWidth: '100%',
            aspectRatio: 1,
          })}
          {renderPhotoSlot(2, {
            flex: 1,
            minWidth: '100%',
            aspectRatio: 1,
          })}
        </View>

        {/* 12 fotos restantes */}
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 10,
        }}>

          {Array.from({ length: 12 }, (_, i) => 
            renderPhotoSlot(i + 3, {
              display: 'flex',
              width: '30%',
              aspectRatio: 1,
              flexDirection: 'column',
              paddingBottom: 16,
            })
          )}
        </View>
      </View>
    )
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
          <ProgressSteps currentStep={4} />
        </View>

        <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
          <Text fontStyle="p-16-bold" color="gray-500" style={{marginBottom: 30}}>
          Inclua fotos no seu anúncio
          </Text>

          {renderPhotoGrid()}

          <View style={{
            backgroundColor: '#F1F4F9',
            borderRadius: 8,
            padding: 8,
            alignSelf: 'center',
          }}>
            <Text color="black" style={{ fontSize: 12, color: 'black' }}>
              {photos.length} de 15 adicionadas
            </Text>
          </View>
        </View>
      </View>
    </PageScaffold>
  );
};

export default Step4;
