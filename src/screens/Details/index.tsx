import { ActivityIndicator, Image, Dimensions, View, Pressable, Linking, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { About, Complete, InfoCard, OfferHead, Optionals, ImageViewer } from './components';
import SwiperFlatList from 'react-native-swiper-flatlist';
import Text from '@components/Text';

import * as D from './styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@routes/app.routes';
import Testimonials from './components/Testimonials';
import BasicButton from '@components/BasicButton';
import { FullscreenIcon, AddPhotoIcon, PhoneIcon, ChatIcon } from '@components/CustomIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SecurityModal from '@components/Modals/Security';
import { useAuth } from '@hooks/useAuth';

const { width } = Dimensions.get('window');

type DetailsProps = NativeStackScreenProps<RootStackParamList, 'adDetails'>;

// Adicionar mockData antes do componente
const mockData = {
  anuncio: {
    id: 1,
    tipo_plano: "premium",
    tipo_plano_str: "Premium",
    tipo_venda: "direta",
    tipo_venda_str: "Direta",
    tipo_vendedor: "lojista",
    tipo_vendedor_str: "Lojista",
    tipo_veiculo: "carro",
    tipo_veiculo_str: "Carro",
    marca_veiculo: "Toyota",
    modelo_veiculo: "Corolla",
    submodelo: "XEI",
    valor_fipe: 90000,
    renavam: "123456789",
    placa: "ABC1D23",
    status_veiculo: "disponivel",
    ano_fabricacao: "2020",
    ano_modelo: "2021",
    quilometragem: 15000,
    num_portas: "4",
    tipo_motor: null,
    tipo_motor_str: "1.8 Flex",
    refrigeracao: null,
    refrigeracao_str: "",
    cilindrada: null,
    cilindrada_str: "",
    partida: null,
    partida_str: "",
    freios: null,
    freios_str: "",
    tipo_freio: null,
    tipo_freio_str: "",
    alimentacao: null,
    alimentacao_str: "",
    alarme: null,
    controle_estabilidade: null,
    roda_liga: null,
    unico_dono: 1,
    unico_dono_str: "Sim",
    tipo_troca: "nenhuma",
    tipo_troca_str: "Nenhuma",
    ipva_pago: 1,
    veiculo_nome_anunciante: 1,
    financiado: 0,
    parcelas_em_dia: null,
    aceita_financiamento: "Sim",
    todas_revisoes_concessionaria: 1,
    passou_leilao: 0,
    possui_manual: 1,
    possui_chave_reserva: 1,
    possui_ar: 1,
    ar_funcionando: 1,
    escapamento_solta_fumaca: 0,
    garantia_fabrica: 1,
    motor_bate: 0,
    cambio_faz_barulho: 0,
    cambio_escapa_marcha: 0,
    luz_injecao: 0,
    luz_airbag: 0,
    luz_abs: 0,
    tipo_monta: "",
    tipo_monta_str: "",
    furtado_roubado: 0,
    valor: "95000",
    descricao: "Carro em ótimo estado, único dono.",
    aceite_termos: 1,
    id_cliente: 1,
    id_plano: null,
    id_modelo: 1,
    id_cor: 1,
    id_tipo_cambio: 1,
    id_tipo_combustivel: 1,
    id_tipo_pneu: 1,
    id_tipo_parabrisa: 1,
    tipo_parabrisa: { id: 1, descricao: "Original" },
    status_str: "Ativo",
    moderacao_str: "Aprovado",
    moderacao_aprovada: null,
    num_cliques: 10,
    obs_moderacao: null,
    created_at: "2023-01-01T00:00:00Z",
    ativo: true,
    pausado: false,
    codigo: "ABC123",
    cidadeAnunciante: "São Paulo",
    cor: { id: 1, descricao: "Prata" },
    tipo_cambio: { id: 1, descricao: "Automático" },
    tipo_combustivel: { id: 1, descricao: "Flex" },
    tipo_pneu: { id: 1, descricao: "Radial" },
    opcionais: [{ id: 1, descricao: "Ar-condicionado" }],
    imagens: [
      "https://cdn.autopapo.com.br/box/uploads/2019/02/11160300/1_corolla_xei_2019.jpg",
      "https://s2-autoesporte.glbimg.com/AwLfzh7i-zhcEhvL33Ki7uTRqZA=/0x0:620x413/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2020/U/k/uinQxBT5uu0vLs9fAD4g/2017-03-16-3corolla-xei-.jpg",
      "https://media.toyota.com.br/b0639be2-9bdd-4820-bcef-d95cd039acbd.jpeg"
    ],
    imagemPrincipal: "https://cdn.autopapo.com.br/box/uploads/2019/02/11160300/1_corolla_xei_2019.jpg",
    usuarioModeracao: {
      email: "moderador@email.com",
      id: 1,
      nome: "Moderador"
    }
  },
  aceitouTermos: true,
  existePedido: false
};

const mockTestimonials = [
  {
    id: 1,
    name: 'Maria Rita Silva',
    city: 'Belo Horizonte - MG',
    date: '15 dias',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Lorem ipsum dolor sit amet consectetur. Posuere ut ultrices euismod urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
  },
  {
    id: 2,
    name: 'Maria Rita Silva',
    city: 'Belo Horizonte - MG',
    date: '15 dias',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Lorem ipsum dolor sit amet consectetur. Posuere ut ultrices euismod urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
  },
  {
    id: 3,
    name: 'Maria Rita Silva',
    city: 'Belo Horizonte - MG',
    date: '15 dias',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Lorem ipsum dolor sit amet consectetur. Posuere ut ultrices euismod urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
  }
];

const Details = ({ route, navigation }: DetailsProps) => {
  const intents = useSafeAreaInsets();
  const { user } = useAuth();
  console.log(intents);
  
  // Estado para controlar o modal de visualização de imagem
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Estado para controlar o modal de segurança
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<'call' | 'whatsapp' | null>(null);
  
  // const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  // const { code } = route.params;
  // const { error, data, isError, isLoading } = useQuery({
  //   queryKey: ['vehicle', code],
  //   queryFn: () => getVehicleDetails(code),
  //   staleTime: 0,
  // });
  //
  // useEffect(() => {
  //   if (isLoading) {
  //     setIsLoadingData(true);
  //   } else {
  //     setIsLoadingData(false);
  //   }
  // }, [isLoading]);
  //
  // useEffect(() => {
  //   return () => {
  //     setIsLoadingData(true);
  //   };
  // }, []);

  // Mock substituindo os estados
  const data = mockData;
  const isLoadingData = false;
  const isError = false;
  const error = null;

  const handleCall = () => {
    // Verifica se o usuário está logado
    if (!user || !user.id) {
      // @ts-ignore - navigation type
      navigation.navigate('auth', { screen: 'login' });
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
    
    setPendingAction('whatsapp');
    setSecurityModalVisible(true);
  };

  const handleOpenImageViewer = (index: number = 0) => {
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  const handleCloseImageViewer = () => {
    setImageViewerVisible(false);
  };

  const handleSecurityModalClose = () => {
    setSecurityModalVisible(false);
    setPendingAction(null);
  };

  const handleSecurityModalAccept = () => {
    setSecurityModalVisible(false);
    
    if (pendingAction === 'call') {
      // Executar a ligação após aceitar os termos
      Linking.openURL('tel:+5511999999999');
    } else if (pendingAction === 'whatsapp') {
      // Executar o WhatsApp após aceitar os termos
      const phoneNumber = '5511999999999';
      const message = 'Olá! Gostaria de saber mais sobre este veículo.';
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
        <View style={{ paddingLeft: 30, paddingTop: 21, paddingBottom: 13, borderBottomColor: '#EBE8D9', borderBottomWidth: 1 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
          >
            <Image source={require('@icons/arrow.png')} />
            <Text color="black" fontStyle="p-18-bold">
              Detalhes do anúncio
            </Text>
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
                data={data.anuncio.imagens}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    resizeMode="cover"
                    style={{ width, height: 240 }}
                  />
                )}
              />
              <D.ExpandButton onPress={() => handleOpenImageViewer()}>
                <FullscreenIcon size={24} color="white" />
              </D.ExpandButton>
            </D.SwiperContainer>
            <View style={{ width: '100%', marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BasicButton
                label='Solicitar mais fotos'
                onPress={() => { console.log('Solicitar mais fotos'); }}
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
              <OfferHead {...data.anuncio} />
              <InfoCard {...data} />
              <About {...data} />
              <Optionals {...data.anuncio} />
              <Testimonials testimonials={mockTestimonials}/>
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
        images={data.anuncio.imagens}
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
