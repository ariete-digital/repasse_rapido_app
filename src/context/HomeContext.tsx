import { AxiosResponse } from 'axios';
import { ReactNode, createContext, useEffect, useState } from 'react';

import { api } from '@lib/api';
import { Offer } from '@screens/Details/types';
import { storageAuthTokenGet } from '@lib/storage/storageAuthToken';
import { useToast } from 'react-native-toast-notifications';

interface DataProps {
  anuncios: Offer[];
  total: number;
}

interface DataFetchProps {
  status: string;
  content: {
    anuncios: Offer[];
  };
}

export interface HomeContextDataProps {
  homePageData: DataProps;
  isLoading: boolean;
  loadHomePageData: () => void;
}

interface HomeContextProviderProps {
  children: ReactNode;
}

export const HomeContext = createContext<HomeContextDataProps>(
  {} as HomeContextDataProps
);

export const HomeContextProvider: React.FC<HomeContextProviderProps> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const toast = useToast();

  const [homePageData, setHomePageData] = useState<DataProps>({
    anuncios: [],
    total: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  storageAuthTokenGet().then((res) => {
    if (res.token) setAuthToken(res.token);
  });

  const loadHomePageData = async () => {
    try {
      setIsLoading(true);
      
      const res: AxiosResponse<DataFetchProps> = await api.get('/cliente/home');

      if (res && res.data && res.data.status === 'success' && res.data.content) {
        setHomePageData({
          anuncios: res.data.content.anuncios || [],
          total: res.data.content.anuncios?.length || 0,
        });
      } else {
        toast.show(
          'Bip Bop! Um erro ocorreu, \n tente novamente mais tarde...',
          { type: 'danger' }
        );
        return Promise.reject(new Error('Invalid response structure'));
      }
    } catch (error) {
      toast.show('Bip Bop! Um erro ocorreu, \n tente novamente mais tarde...', {
        type: 'danger',
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHomePageData();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        homePageData,
        isLoading,
        loadHomePageData,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
