import React from 'react';
import { TouchableOpacity, ScrollView, Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@hooks/useAuth';
import Text from '@components/Text';
import * as M from './styles';

import { MenuItem } from './types';
import HeaderLogo from '@components/HeaderLogo';
import { MaterialIcons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { PersonIcon } from '@icons/PersonIcon';
import { SearchIcon } from '@icons/SearchIcon';
import { CarIcon } from '@icons/CarIcon';
import { GearIcon } from '@icons/GearIcon';
import { EyeIcon } from '@icons/EyeIcon';
import { HelpIcon } from '@icons/HelpIcon';
import { ExitIcon } from '@icons/ExitIcon';

/**
 * Tela de Menu - Exibe as opções principais do aplicativo
 * Inclui perfil do usuário, navegação para outras telas e logout
 */
const Menu = () => {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

  const menuItems: MenuItem[] = [
    {
      id: 'account',
      title: 'Minha Conta',
      icon: <SvgXml xml={PersonIcon()} width={20} height={20} />,
      onPress: () => {
        // Navegar para tela de conta
      }
    },
    {
      id: 'search',
      title: 'Buscar Veículos',
      icon: <SvgXml xml={SearchIcon()} width={20} height={20} />,
      onPress: () => {
        navigation.navigate('search' as never);
      }
    },
    {
      id: 'advertise',
      title: 'Anunciar meu veículo',
      icon: <SvgXml xml={CarIcon()} width={20} height={20} />,
      onPress: () => {
        // Navegar para tela de anúncio
      }
    },
    {
      id: 'manage',
      title: 'Gerenciar meu anúncio',
      icon: <SvgXml xml={GearIcon()} width={20} height={20} />,
      onPress: () => {
        // Navegar para gerenciar anúncio
      }
    },
    {
      id: 'managePF',
      title: 'Gerenciar anúncios de PF',
      icon: <SvgXml xml={EyeIcon()} width={20} height={20} />,
      onPress: () => {
        // Navegar para gerenciar anúncios PF
      }
    },
    {
      id: 'help',
      title: 'Ajuda',
      icon: <SvgXml xml={HelpIcon()} width={20} height={20} />,
      onPress: () => {
        // Navegar para tela de ajuda
      }
    },
    {
      id: 'logout',
      title: 'Sair',
      icon: <SvgXml xml={ExitIcon()} width={20} height={20} />,
      onPress: () => {
        signOut();
      }
    }
  ];

  return (
    <M.Container>
      <M.Header>
        <HeaderLogo />
        <View 
          style={{
            justifyContent: "flex-start",
            width: "100%",
            alignItems: "flex-start"
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <MaterialIcons name="chevron-left" size={38} color={"#272A30"} />
            <Text fontStyle="p-18-regular" color="black-400" style={{ fontFamily: 'Cabin'}}>
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </M.Header>

      <M.UserSection>
        <M.UserInfo>
            <Text fontStyle="p-18-bold" color="brand-red">{user?.nome || 'Usuário'}</Text>
            <Text fontStyle="p-14-regular" color="black-200">{user?.email || 'email@exemplo.com'}</Text>
        </M.UserInfo>
        <M.UserTag>
          <Text fontStyle="c-12-bold" color="clear-white">Repassador</Text>
        </M.UserTag>
      </M.UserSection>

      <M.MenuList>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <TouchableOpacity onPress={item.onPress}>
              <M.MenuItem>
                <M.MenuIcon>
                  {item.icon}
                </M.MenuIcon>
                <M.MenuText>
                  <Text fontStyle="p-16-regular" color="black">{item.title}</Text>
                </M.MenuText>
              </M.MenuItem>
            </TouchableOpacity>
            {index < menuItems.length - 1 && <M.Separator />}
          </React.Fragment>
        ))}
      </M.MenuList>
    </M.Container>
  );
};

export default Menu; 