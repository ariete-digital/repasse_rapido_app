import {
  RefreshControl,
} from 'react-native';
import { useHome } from '@hooks/useHome';
import HeaderHome from './components/HeaderBanner';
import HeaderUserRow from './components/HeaderUserRow';

import * as H from './styles';
import { StoresArea } from './components/StoresArea';
import ItemCard from '@components/ItemCard';

const Home = () => {
  const { isLoading, loadHomePageData } = useHome();

  return (
    <H.Container>
      <HeaderUserRow />
      <H.ScrollingContent
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadHomePageData}
            colors={['rgba(154, 11, 38, 1)', 'rgba(225, 17, 56, 1)']} // Para Android
            tintColor="rgba(225, 17, 56, 1)" // Para iOS
          />
        }
      >
        <HeaderHome />
        <H.OffersContainer>
          <H.RowContainer >
            <ItemCard
              itemID={1}
              key={"0001"}
              brand={"Hyundai"}
              model={"HB20"}
              description={"1.0 Comfort Style (Flex)"}
              imageUrl={"https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1"}
              price={"10000"}
              fipePrice={"100000"}
              storeName={"Loja Teste Repasses"}
              itemPerRow={2}
            />
            <ItemCard
              itemID={2}
              key={"0002"}
              brand={"Hyundai"}
              model={"HB20"}
              description={"1.0 Comfort Style (Flex)"}
              imageUrl={"https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1"}
              price={"10000"}
              fipePrice={"100000"}
              storeName={"Loja Teste Repasses"}
              itemPerRow={2}
            />
          </H.RowContainer>
          <H.RowContainer >
            <ItemCard
              itemID={3}
              key={"0003"}
              brand={"Hyundai"}
              model={"HB20"}
              description={"1.0 Comfort Style (Flex)"}
              imageUrl={"https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1"}
              price={"10000"}
              fipePrice={"100000"}
              storeName={"Loja Teste Repasses"}
              itemPerRow={2}
            />
            <ItemCard
              itemID={4}
              key={"0004"}
              brand={"Hyundai"}
              model={"HB20"}
              description={"1.0 Comfort Style (Flex)"}
              imageUrl={"https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/02/Hyundai-HB20-Platinum-Plus.jpg?w=1200&h=675&crop=1"}
              price={"10000"}
              fipePrice={"100000"}
              storeName={"Loja Teste Repasses"}
              itemPerRow={2}
            />
          </H.RowContainer>
        </H.OffersContainer>
        <StoresArea />
      </H.ScrollingContent>
    </H.Container>
  );
};

export default Home;
