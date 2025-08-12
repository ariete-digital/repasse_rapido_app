import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { HeaderLogo, Text } from '@components/index';
import Individual from './components/Individual';
import Legal from './components/Legal';
import * as R from './styles';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import Autonomo from './components/Autonomo';

const Register = () => {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  
  const [currentTab, setCurrentTab] = useState<'individual' | 'autonomo' | 'legal'>(
    'individual'
  );

  const toggleTab = (tab: 'individual' | 'autonomo' | 'legal') => {
    setCurrentTab(tab);
  };

  return (
    <R.Container>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#EBE8D9",
          marginBottom: 20
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

      <HeaderLogo />

      <R.TabContainer>
        <R.TabButton
          style={{
            backgroundColor:
              currentTab === 'individual' ? '#9A0B26' : '#C8C6C6',
          }}
          onPress={() => toggleTab('individual')}
        >
          <Text color="white" align='center' fontStyle="c-12-bold">
            Pessoa Física
          </Text>
        </R.TabButton>
        <R.TabButton
          style={{
            backgroundColor:
              currentTab === 'autonomo' ? '#9A0B26' : '#C8C6C6',
          }}
          onPress={() => toggleTab('autonomo')}
        >
          <Text color="white" align='center' fontStyle="c-12-bold">
            Autônomo
          </Text>
        </R.TabButton>
        <R.TabButton
          style={{
            backgroundColor: currentTab === 'legal' ? '#9A0B26' : '#C8C6C6',
          }}
          onPress={() => toggleTab('legal')}
        >
          <Text color="white" align='center' fontStyle="c-12-bold">
            Repassador (PJ)
          </Text>
        </R.TabButton>
      </R.TabContainer>

      <R.TabContent>
        <ScrollView
          style={{
            width: '100%',
            height: '70%',
          }}
          contentContainerStyle={{ paddingTop: 10, gap: 20 }}
        >
          <Text color="black-700">Preencha os campos abaixo:</Text>
          {currentTab === 'individual' && <Individual />}
          {currentTab === 'autonomo' && <Autonomo />}
          {currentTab === 'legal' && <Legal />}
        </ScrollView>
      </R.TabContent>
    </R.Container>
  );
};

export default Register;
