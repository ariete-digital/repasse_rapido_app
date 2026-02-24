import bannerImg from '@images/banner_repasse.png';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Image as ReactNativeImage } from 'react-native';
import { RootTabParamList } from '@routes/app.routes';
import { useAuth } from '@hooks/useAuth';
import * as H from './styles';

type NavigationProps = BottomTabNavigationProp<RootTabParamList>;

const { width: bannerWidth, height: bannerHeight } = ReactNativeImage.resolveAssetSource(bannerImg);
const bannerAspectRatio = bannerWidth / bannerHeight;

function HeaderHome() {
  const navigation = useNavigation<NavigationProps>();
  const { user } = useAuth();

  const handleGoToSearch = () => {
    navigation.navigate('search' as never);
  };

  const handleGoToSell = () => {
    if (!user || !user.id) {
      navigation.navigate('auth' as never);
      return;
    }

    if (user.tipo === 'A') {
      return;
    }

    navigation.navigate('sell' as never);
  };

  return (
    <H.Container>
      <H.BannerImage source={bannerImg} contentFit="contain" $aspectRatio={bannerAspectRatio} />
      <H.ActionsRow>
        <H.ActionButton onPress={handleGoToSearch} activeOpacity={0.85}>
          <H.ActionButtonText>Comprar</H.ActionButtonText>
        </H.ActionButton>
        <H.ActionButton onPress={handleGoToSell} activeOpacity={0.85}>
          <H.ActionButtonText>Vender</H.ActionButtonText>
        </H.ActionButton>
      </H.ActionsRow>
    </H.Container>
  );
}

export default HeaderHome;
