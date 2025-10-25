import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams, CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, Platform } from 'react-native';
import { useAuth } from '@hooks/useAuth';

import {
  Details,
  Filter,
  Home,
  Menu,
  MoreInfo,
  MyAccount,
  SearchResults,
  Services,
  Specifications,
  Transfers,
  ManageAds,
  ViewPFAds,
} from '@screens/index';
import ProtectedRoute from '@components/ProtectedRoute';
import { AdvertiseProvider } from '@screens/Advertise/context/AdvertiseContext';

import { Offer } from '@screens/Details/types';
import HomeTabIcon from '@icons/HomeTabIcon';
import SearchTabIcon from '@icons/SearchTabIcon';
import ContactTabIcon from '@icons/ContactTabIcon';
import SellTabIcon from '@icons/SellTabIcon';
import MenuTabIcon from '@icons/MenuTabIcon';
import AuthRoutes from './auth.routes';
import { AdvertiseStackParamList } from '@screens/Advertise/types';
import AdvertiseHome from '@screens/Advertise/AdvertiseHome';
import Step1 from '@screens/Advertise/Step1';
import Step2 from '@screens/Advertise/Step2';
import Step3 from '@screens/Advertise/Step3';
import Step4 from '@screens/Advertise/Step4';
import Step5 from '@screens/Advertise/Step5';
import Step6 from '@screens/Advertise/Step6';
import Success from '@screens/Advertise/Success';
import SelectOptions from '@screens/Advertise/SelectOptions';

// Stack interno da aba 'search'
export type SearchStackParamList = {
  searchScreen: undefined;
  filter: { filters: any };
  specifications: Offer;
  SearchDetails: { code: string };
};

// Tabs principais
export type RootTabParamList = {
  home: undefined;
  search: NavigatorScreenParams<SearchStackParamList>;
  sell: undefined;
  contact: undefined;
  menu: undefined;
};

// Stack principal
export type RootStackParamList = {
  AppTabs: undefined;
  adDetails: { code: string };
  moreInfo: Offer;
  myAccount: undefined;
  manageAds: undefined;
  viewPFAds: undefined;
  auth: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const AdvertiseStack = createNativeStackNavigator<AdvertiseStackParamList>();

const AdvertiseRoutes = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!user || !user.id) {
      // @ts-ignore
      navigation.navigate('auth', { screen: 'login' });
    }
  }, [user]);

  if (!user || !user.id) {
    return null;
  }

  return (
    <AdvertiseProvider>
      <AdvertiseStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <AdvertiseStack.Screen name="advertiseHome" component={AdvertiseHome} />
        <AdvertiseStack.Screen name="advertiseStep1" component={Step1} />
        <AdvertiseStack.Screen name="advertiseStep2" component={Step2} />
        <AdvertiseStack.Screen name="advertiseStep3" component={Step3} />
        <AdvertiseStack.Screen name="advertiseStep4" component={Step4} />
        <AdvertiseStack.Screen name="advertiseStep5" component={Step5} />
        <AdvertiseStack.Screen name="advertiseStep6" component={Step6} />
        <AdvertiseStack.Screen name="advertiseSuccess" component={Success} />
        <AdvertiseStack.Screen 
          name="selectOptions" 
          component={SelectOptions}
          options={{
            presentation: 'modal',
          }}
        />
      </AdvertiseStack.Navigator>
    </AdvertiseProvider>
  );
};

const SearchStackScreen = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen
      name="searchScreen"
      component={SearchResults}
      options={{ headerShown: false }}
    />
    <SearchStack.Screen
      name="filter"
      component={Filter}
      options={{ headerShown: false }}
    />
    <SearchStack.Screen
      name="specifications"
      component={Specifications}
      options={{ headerBackTitle: 'Ficha técnica', headerTitle: '' }}
    />
  </SearchStack.Navigator>
);

const Tabs = () => {
  const { user } = useAuth();

  const checkAuthAndNavigate = (navigation: any, routeName: string) => {
    if (!user || !user.id) {
      // Se não estiver logado, redireciona para login
      navigation.dispatch(
        CommonActions.navigate({
          name: 'auth',
          params: { screen: 'login' }
        })
      );
      return false;
    }
    return true;
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60,
          paddingBottom: 8,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontFamily: 'MontserratRegular',
          fontSize: 12,
          fontWeight: '700',
          marginTop: -10
        },
        tabBarActiveTintColor: '#E11138',
        tabBarInactiveTintColor: '#040707',
        headerShown: false,
      }}
      tabBar={(navigation) => {
        return <BottomTabBar {...navigation} />;
      }}
    >
    <Tab.Screen
      name="home"
      component={Home}
      options={{
        title: 'Início',
        tabBarIcon: ({ color }) => (
          <HomeTabIcon color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="search"
      component={SearchStackScreen}
      options={{
        title: 'Busca',
        tabBarIcon: ({ color }) => (
          <SearchTabIcon color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="sell"
      component={AdvertiseRoutes}
      options={{
        title: 'Vender',
        tabBarIcon: ({ color }) => (
          <SellTabIcon color={color} />
        ),
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          if (!checkAuthAndNavigate(navigation, 'sell')) {
            e.preventDefault();
          }
        },
      })}
    />
    <Tab.Screen
      name="contact"
      component={() => null}
      options={{
        title: 'Contato',
        tabBarIcon: ({ color }) => (
          <ContactTabIcon color={color} />
        ),
      }}
    />  
    <Tab.Screen
      name="menu"
      options={{
        title: 'Menu',
        tabBarIcon: ({ color }) => (
          <MenuTabIcon color={color} />
        ),
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          if (!checkAuthAndNavigate(navigation, 'menu')) {
            e.preventDefault();
          }
        },
      })}
    >
      {(props) => (
        <ProtectedRoute>
          <Menu {...props} />
        </ProtectedRoute>
      )}
    </Tab.Screen>
  </Tab.Navigator>
  );
};

const AppRoutes = () => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="AppTabs"
      component={Tabs}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="adDetails"
      component={Details}
      options={{
        headerShown: false,
        presentation: 'modal'
      }}
    />
    <RootStack.Screen
      name="moreInfo"
      component={MoreInfo}
      options={{ 
        headerShown: false,
        presentation: 'modal'
      }}
    />
    <RootStack.Screen
      name="myAccount"
      options={{ 
        headerShown: false
      }}
    >
      {(props) => (
        <ProtectedRoute>
          <MyAccount {...props} />
        </ProtectedRoute>
      )}
    </RootStack.Screen>
    <RootStack.Screen
      name="manageAds"
      options={{ 
        headerShown: false
      }}
    >
      {(props) => (
        <ProtectedRoute>
          <ManageAds {...props} />
        </ProtectedRoute>
      )}
    </RootStack.Screen>
    <RootStack.Screen
      name="viewPFAds"
      options={{ 
        headerShown: false
      }}
    >
      {(props) => (
        <ProtectedRoute>
          <ViewPFAds {...props} />
        </ProtectedRoute>
      )}
    </RootStack.Screen>
    <RootStack.Screen
      name="auth"
      component={AuthRoutes}
      options={{ headerShown: false }}
    />
  </RootStack.Navigator>
);

export default AppRoutes;
