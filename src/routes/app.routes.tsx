import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import { Image, Platform, View } from 'react-native';

import {
  Details,
  Filter,
  Home,
  Menu,
  MoreInfo,
  SearchResults,
  Services,
  Specifications,
  Transfers,
} from '@screens/index';

import { Offer } from '@screens/Details/types';
import HomeTabIcon from '@icons/HomeTabIcon';
import SearchTabIcon from '@icons/SearchTabIcon';
import ContactTabIcon from '@icons/ContactTabIcon';
import SellTabIcon from '@icons/SellTabIcon';
import MenuTabIcon from '@icons/MenuTabIcon';
import AuthRoutes from './auth.routes';

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
  auth: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();

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

const Tabs = () => (
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
      component={() => <View style={{ flex: 1, backgroundColor: 'red' }} />}
      options={{
        title: 'Vender',
        tabBarIcon: ({ color }) => (
          <SellTabIcon color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="contact"
      component={() => <View style={{ flex: 1, backgroundColor: 'red' }} />}
      options={{
        title: 'Contato',
        tabBarIcon: ({ color }) => (
          <ContactTabIcon color={color} />
        ),
      }}
    />  
    <Tab.Screen
      name="menu"
      component={Menu}
      options={{
        title: 'Menu',
        tabBarIcon: ({ color }) => (
          <MenuTabIcon color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

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
      name="auth"
      component={AuthRoutes}
      options={{ headerShown: false }}
    />
  </RootStack.Navigator>
);

export default AppRoutes;
