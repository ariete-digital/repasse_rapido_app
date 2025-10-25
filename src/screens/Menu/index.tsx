import React from 'react';
import { TouchableOpacity, ScrollView, Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@hooks/useAuth';
import Text from '@components/Text';
import * as M from './styles';

import { MenuItem } from './types';
import { SvgXml } from 'react-native-svg';
import { PersonIcon } from '@icons/PersonIcon';
import { SearchIcon } from '@icons/SearchIcon';
import { CarIcon } from '@icons/CarIcon';
import { GearIcon } from '@icons/GearIcon';
import { EyeIcon } from '@icons/EyeIcon';
import { HelpIcon } from '@icons/HelpIcon';
import { ExitIcon } from '@icons/ExitIcon';
import PageScaffold from '@components/PageScaffold';

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
        navigation.navigate('myAccount' as never);
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
        navigation.navigate('sell' as never);
      }
    },
    {
      id: 'manage',
      title: 'Gerenciar meus anúncios',
      icon: <SvgXml xml={GearIcon()} width={20} height={20} />,
      onPress: () => {
        navigation.navigate('manageAds' as never);
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

  // Adiciona item "Visualizar anúncios de PF" apenas para usuários tipo A (autônomo) ou PJ (pessoa jurídica)
  if (user?.tipo === 'A' || user?.tipo === 'PJ') {
    const managePFItem = {
      id: 'managePF',
      title: 'Visualizar anúncios de PF',
      icon: <SvgXml xml={EyeIcon()} width={20} height={20} />,
      onPress: () => {
        navigation.navigate('viewPFAds' as never);
      }
    };
    
    // Insere antes do item "Ajuda" (penúltimo item)
    menuItems.splice(menuItems.length - 2, 0, managePFItem);
  }
  
  return (
    <PageScaffold>
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
    </PageScaffold>
  );
};

export default Menu; 