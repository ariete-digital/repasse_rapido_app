import React, { forwardRef } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from '@components/CustomIcons';
import Text from '@components/Text';
import HeaderLogo from '@components/HeaderLogo';
import { useAuth } from '@hooks/useAuth';
import * as S from './styles';

type PageScaffoldProps = {
  userTitle?: string;
  userSubtitle?: string;
  userTagLabel?: string;
  titleText?: string;
  titleIcon?: React.ReactNode;
  children: React.ReactNode;
  onBackPress?: () => void;
  floatingButton?: React.ReactNode;
  scrollViewRef?: React.RefObject<ScrollView>;
};

const PageScaffold: React.FC<PageScaffoldProps> = ({
  userTitle: userTitleProp,
  userSubtitle: userSubtitleProp,
  userTagLabel: userTagLabelProp,
  titleText,
  titleIcon,
  children,
  onBackPress,
  floatingButton,
  scrollViewRef,
}) => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const getUserTagLabel = () => {
    if (userTagLabelProp) return userTagLabelProp;
    
    if (!user?.tipo) return '';
    
    switch (user.tipo) {
      case 'PF':
        return 'Pessoa Física';
      case 'PJ':
        return 'Repassador';
      case 'A':
        return 'Autônomo';
      default:
        return '';
    }
  };

  const userTitle = userTitleProp || user?.nome || 'Usuário';
  const userSubtitle = userSubtitleProp || user?.email || '';
  const userTagLabel = getUserTagLabel();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    // @ts-ignore - navigation may not have goBack typed depending on stack
    navigation.goBack();
  };

  return (
    <S.Container>
      <S.Header>
        <HeaderLogo />
        <View
          style={{
            justifyContent: 'flex-start',
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <ChevronLeftIcon size={38} color={'#272A30'} />
            <Text fontStyle="p-18-regular" color="black-400" style={{ fontFamily: 'Cabin' }}>
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </S.Header>

      <S.UserSection>
        <S.UserInfo>
          <Text fontStyle="p-18-bold" color="brand-red">{userTitle}</Text>
          <Text fontStyle="p-14-regular" color="black-200">{userSubtitle}</Text>
        </S.UserInfo>
        <S.UserTag>
          <Text fontStyle="c-12-bold" color="clear-white">{userTagLabel}</Text>
        </S.UserTag>
      </S.UserSection>

      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={floatingButton ? { paddingBottom: 100 } : undefined}
      >
        {!!titleText && (
          <View
            style={{
              paddingHorizontal: 30,
              paddingTop: 20,
            }}
          >
            <S.TitleContainer>
              {!!titleIcon && <S.TitleIcon>{titleIcon}</S.TitleIcon>}
              <S.TitleText>
                <Text fontStyle="p-16-regular" color="black">{titleText}</Text>
              </S.TitleText>
            </S.TitleContainer>
          </View>
        )}

        {children}
      </ScrollView>

      {floatingButton}
    </S.Container>
  );
};

export default PageScaffold;

