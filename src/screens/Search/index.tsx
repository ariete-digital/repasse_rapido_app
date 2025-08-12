import AutocompleteDropdown from '@components/Autocomplete';
import GradientButton from '@components/GradientButton';
import Text from '@components/Text';
import { useFilters } from '@hooks/useFilters';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchStackParamList } from '@routes/app.routes';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as S from './styles';

type SearchNavigationProps = NativeStackNavigationProp<
  SearchStackParamList,
  'searchScreen'
>;

const Search = () => {
  const [value, setValue] = useState<string>();

  const {
    filterParams,
    setFilterParams,
    searchResults,
    isRefetching,
    refetchSearchResults,
    resetFilters,
  } = useFilters();

  const navigation = useNavigation<SearchNavigationProps>();

  const toggleCarOrBycicle = async (vehicleType: 'C' | 'M') => {
    resetFilters('C');
    setFilterParams((prev) => ({
      ...prev,
      tipo_veiculo: vehicleType,
    }));
    await refetchSearchResults({ throwOnError: false, cancelRefetch: true });
    navigation.navigate('searchScreen');
  };

  const doSearch = async () => {
    setFilterParams({ ...filterParams, tipo_venda: 'C', marca: value });
    await refetchSearchResults({ throwOnError: false, cancelRefetch: true });

    if (searchResults || !isRefetching) {
      navigation.navigate('searchScreen');
    }
  };

  useEffect(() => {
    if (value !== undefined && value?.length > 0) {
      doSearch();
    }
  }, [value]);

  return (
    <S.Wrapper>
      <S.Container>
        <S.HeaderButtonsRow>
          <S.HeaderButton onPress={() => toggleCarOrBycicle('C')}>
            <Text color="brand-blue" fontStyle="t-24">
              Carros
            </Text>
            <S.HeaderButtonLine />
          </S.HeaderButton>
          <S.HeaderButton onPress={() => toggleCarOrBycicle('M')}>
            <Text color="brand-blue" fontStyle="t-24">
              Motos
            </Text>
            <S.HeaderButtonLine />
          </S.HeaderButton>
        </S.HeaderButtonsRow>

        <View
          style={{
            padding: 10,
          }}
        >
          <Text color="black-700" align="center" fontStyle="p-14-bold">
            Qual veículo você procura?
          </Text>
          <AutocompleteDropdown
            placeholder="Digite a marca ou modelo"
            label=""
            filter="marcas"
            // @ts-ignore
            onChangeValue={(v) => setValue(v)}
          />
        </View>

        <GradientButton
          paddingY={16}
          onPress={doSearch}
          disabled={isRefetching}
        >
          {isRefetching ? (
            <ActivityIndicator />
          ) : (
            <Text color="white" fontStyle="p-14-bold">
              Pesquisar
            </Text>
          )}
        </GradientButton>
      </S.Container>
    </S.Wrapper>
  );
};

export default Search;
