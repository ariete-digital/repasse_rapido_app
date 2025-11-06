import { ActivityIndicator, Image, Dimensions, View, Pressable, Linking, ScrollView, useWindowDimensions, Platform, Share } from 'react-native';
import { useEffect, useState } from 'react';
import { About, Complete, InfoCard, OfferHead, Optionals, ImageViewer, CommentInput } from './components';
import SwiperFlatList from 'react-native-swiper-flatlist';
import Text from '@components/Text';
import { useQuery } from '@tanstack/react-query';

import * as D from './styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@routes/app.routes';
import Testimonials from './components/Testimonials';
import BasicButton from '@components/BasicButton';
import { FullscreenIcon, AddPhotoIcon, PhoneIcon, ChatIcon, ShareIcon } from '@components/CustomIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SecurityModal from '@components/Modals/Security';
import { useAuth } from '@hooks/useAuth';
import { getAnuncioDetails, AnuncioDetailsResponse } from '@services/details';

const { width } = Dimensions.get('window');

type DetailsProps = NativeStackScreenProps<RootStackParamList, 'adDetails'>;


const Details = ({ route, navigation }: DetailsProps) => {
  const intents = useSafeAreaInsets();
  const { user } = useAuth();
  const { code } = route.params;
  
  // Estado para controlar o modal de visualização de imagem
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  
  // Estado para controlar o modal de segurança
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<'call' | 'whatsapp' | null>(null);
  
  // Buscar dados do anúncio
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['anuncio-details', code],
    queryFn: () => getAnuncioDetails(code),
    staleTime: 0,
    enabled: !!code,
  });

  const isLoadingData = isLoading;

  const handleCall = () => {
    // Verifica se o usuário está logado
    if (!user || !user.id) {
      // @ts-ignore - navigation type
      navigation.navigate('auth', { screen: 'login' });
      return;
    }
    
    // Verifica se há dados do anunciante e telefone disponível
    if (!data?.anunciante?.telefone && !data?.anunciante?.celular) {
      alert('Telefone do anunciante não disponível');
      return;
    }
    
    setPendingAction('call');
    setSecurityModalVisible(true);
  };

  const handleWhatsApp = () => {
    // Verifica se o usuário está logado
    if (!user || !user.id) {
      // @ts-ignore - navigation type
      navigation.navigate('auth', { screen: 'login' });
      return;
    }
    
    // Verifica se há dados do anunciante e celular/telefone disponível
    if (!data?.anunciante?.celular && !data?.anunciante?.telefone) {
      alert('Celular do anunciante não disponível');
      return;
    }
    
    setPendingAction('whatsapp');
    setSecurityModalVisible(true);
  };

  const handleOpenImageViewer = (index: number = 0, allImages: boolean = false) => {
    setShowAllImages(allImages);
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  const handleRequestMorePhotos = () => {
    // Verifica se o usuário está logado
    if (!user || !user.id) {
      // @ts-ignore - navigation type
      navigation.navigate('auth', { screen: 'login' });
      return;
    }
    
    // Abre o viewer com todas as imagens
    handleOpenImageViewer(0, true);
  };

  const handleShare = async () => {
    try {
      const anuncioInfo = data?.anuncio;
      if (!anuncioInfo) return;

      // Criar deeplink para o anúncio
      const deepLink = `com.repasserapido.client://anuncio/${code}`;
      
      // Criar mensagem para compartilhar com deeplink
      const shareMessage = `Confira este veículo: ${anuncioInfo.marca_veiculo} ${anuncioInfo.modelo_veiculo}\n\n${deepLink}`;

      const result = await Share.share({
        message: shareMessage,
        url: deepLink, // Usar deeplink custom
        title: `${anuncioInfo.marca_veiculo} ${anuncioInfo.modelo_veiculo}`, // Android
      });

      if (result.action === Share.sharedAction) {
        // Opcional: mostrar feedback de sucesso
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handleCloseImageViewer = () => {
    setImageViewerVisible(false);
    setShowAllImages(false);
  };

  const handleSecurityModalClose = () => {
    setSecurityModalVisible(false);
    setPendingAction(null);
  };

  const handleSecurityModalAccept = () => {
    setSecurityModalVisible(false);
    
    if (pendingAction === 'call') {
      // Executar a ligação após aceitar os termos
      // Prioriza telefone fixo, depois celular
      const phoneNumber = data?.anunciante?.telefone?.replace(/\D/g, '') || 
                          data?.anunciante?.celular?.replace(/\D/g, '') || 
                          '5511999999999';
      Linking.openURL(`tel:+${phoneNumber}`);
    } else if (pendingAction === 'whatsapp') {
      // Executar o WhatsApp após aceitar os termos
      // Prioriza celular, depois telefone fixo
      const phoneNumber = data?.anunciante?.celular?.replace(/\D/g, '') || 
                          data?.anunciante?.telefone?.replace(/\D/g, '') || 
                          '5511999999999';
      const message = `Olá! Gostaria de saber mais sobre este veículo: ${data?.anuncio?.marca_veiculo} ${data?.anuncio?.modelo_veiculo} - ${data?.anuncio?.codigo}`;
      const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      Linking.openURL(whatsappUrl);
    }
    
    setPendingAction(null);
  };

  if (isError) {
    return <Text color="black" fontStyle="p-18-bold">Cannot load vehicle data {JSON.stringify(error)}</Text>;
  }

  return (
    <D.Container as={View} style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingLeft: 30, paddingRight: 30, paddingTop: 21, paddingBottom: 13, borderBottomColor: '#EBE8D9', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}
          >
            <Image source={require('@icons/arrow.png')} />
            <Text color="black" fontStyle="p-18-bold">
              Detalhes do anúncio
            </Text>
          </Pressable>
          <Pressable
            onPress={handleShare}
            style={{ padding: 8 }}
          >
            <ShareIcon size={24} color="#040707" />
          </Pressable>
        </View>
        {!!data && !isLoadingData ? (
          <>
            <D.SwiperContainer>
              <SwiperFlatList
                autoplay={false}
                autoplayDelay={2}
                autoplayLoop
                showPagination
                paginationStyleItem={{ width: 10, height: 10, marginTop: 10 }}
                paginationStyle={{
                  gap: -10,
                }}
                data={(data?.anuncio?.imagens || []).slice(0, 5)}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    resizeMode="cover"
                    style={{ width, height: 240 }}
                  />
                )}
              />
              <D.ExpandButton onPress={() => handleOpenImageViewer(0, false)}>
                <FullscreenIcon size={24} color="white" />
              </D.ExpandButton>
            </D.SwiperContainer>
            <View style={{ width: '100%', marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BasicButton
                label='Solicitar mais fotos'
                onPress={handleRequestMorePhotos}
                backgroundColor='transparent'
                width='170'
                customStyles={{
                  borderWidth: 1,
                  borderColor: '#EBE8D9',
                  borderRadius: 0,
                  padding: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <AddPhotoIcon size={20} color="#353535" />
                <Text fontStyle="c-12-bold" color="black-400">Solicitar mais fotos</Text>
              </BasicButton>
            </View>
            <D.ItemsContainer>
              <OfferHead anuncio={data.anuncio as any} anunciante={data.anunciante} />
              <InfoCard {...(data as any)} />
              <About {...(data as any)} />
              <Optionals {...(data.anuncio as any)} />
              <CommentInput anuncioId={data.anuncio.id} />
              <Testimonials testimonials={data?.anuncio?.avaliacoes || []}/>
            </D.ItemsContainer>
          </>
        ) : (
          <D.LoadingContainer>
            <ActivityIndicator />
          </D.LoadingContainer>
        )}
      </ScrollView>
      {/* Botões flutuantes */}
      <D.FloatingButtonsContainer>
        <D.FloatingButton 
          backgroundColor="#25513C" 
          onPress={handleCall}
        >
          <PhoneIcon size={20} color="white" />
          <Text fontStyle="p-14-bold" color="white">Ligar</Text>
        </D.FloatingButton>
        
        <D.FloatingButton 
          backgroundColor="#38AE76" 
          onPress={handleWhatsApp}
        >
          <ChatIcon size={20} color="white" />
          <Text fontStyle="p-14-bold" color="white">WhatsApp</Text>
        </D.FloatingButton>
      </D.FloatingButtonsContainer>
      
      {/* Modal de visualização de imagem */}
      <ImageViewer
        visible={imageViewerVisible}
        onClose={handleCloseImageViewer}
        images={
          showAllImages 
            ? (data?.anuncio?.imagens || [])
            : ((data?.anuncio?.imagens || []).slice(0, 5))
        }
        initialIndex={currentImageIndex}
      />

      {/* Modal de segurança */}
      <SecurityModal
        visible={securityModalVisible}
        setModalVisible={handleSecurityModalClose}
        onAccept={handleSecurityModalAccept}
      />
    </D.Container>
  );
};

export default Details;
