import {
  FilterOptions,
  FilteredApiResponse,
  getBrands,
  getCity,
  getColors,
  getFilteredData,
  getFilterDataWithCount,
  getModels,
  getOpcionais,
  getState,
  getTiposCambio,
  getTiposCombustivel,
} from '@services/filters';
import { useQuery } from '@tanstack/react-query';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type DefaultValue = {
  value: number;
  label: string;
};

type DefaultFilterValues = {
  id: number;
  descricao: string;
};

type FilterValues = {
  min: number;
  max: number;
};

type FiltersState = {
  filterParams: FilterOptions;
  isLoading: boolean;
  error: any;
  filterValues: {
    year: FilterValues;
    price: FilterValues;
    km: FilterValues;
    transmissionType: DefaultFilterValues[] | undefined;
    version: string;
    vehicleCurrentStateOption: ['U' | 'N'];
    fuelType: DefaultFilterValues[] | undefined;
    doorsQt: DefaultFilterValues[] | undefined;
    colors: DefaultValue[] | undefined;
    optionals: DefaultFilterValues[] | undefined;
    states: DefaultValue[] | undefined;
    cities: DefaultValue[] | undefined;
    brands: DefaultValue[] | undefined;
    models: DefaultValue[] | undefined;
    tiposCambio: DefaultFilterValues[] | undefined;
    tiposCombustivel: DefaultFilterValues[] | undefined;
    ordering: string;
  };
  setFilterValues: Dispatch<SetStateAction<FiltersState['filterValues']>>;
  setFilterParams: Dispatch<SetStateAction<FilterOptions>>;
  search: {
    colors: string;
    state: string;
    city: string;
    brand: string;
    model: string;
  };
  setSearch: Dispatch<
    SetStateAction<{
      colors: string;
      state: string;
      city: string;
      brand: string;
      model: string;
    }>
  >;
  searchResults?: FilteredApiResponse;
  transferSearchResults?: FilteredApiResponse;
  filterDataWithCount?: {
    anuncios: any[];
    total: number;
    filterCounts: {
      marcas: { id: number; descricao: string; count: number }[];
      modelos: { id: number; descricao: string; count: number }[];
      cores: { id: number; descricao: string; count: number }[];
      tiposCambio: { id: number; descricao: string; count: number }[];
      tiposCombustivel: { id: number; descricao: string; count: number }[];
      opcionais: { id: number; descricao: string; count: number }[];
    };
  };
  isSearchResultsLoading: boolean;
  isTransferSearchResultsLoading: boolean;
  isRefetching: boolean;
  isTransferSearchResultsRefetching: boolean;
  transferSearchResultsErrors: Error | null;
  refetchSearchResults: ({
    throwOnError,
    cancelRefetch,
  }: {
    throwOnError: boolean;
    cancelRefetch: boolean;
  }) => any;
  refetchTransferSearchResults: ({
    throwOnError,
    cancelRefetch,
  }: {
    throwOnError: boolean;
    cancelRefetch: boolean;
  }) => any;
  resetFilters: (tipo_venda?: 'R' | 'C') => void;
};

type FiltersContextProviderProps = {
  children: React.ReactNode;
};

export const FiltersContext = createContext<FiltersState>({} as FiltersState);

export const FiltersContextProvider = ({
  children,
}: FiltersContextProviderProps) => {
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [filterParams, setFilterParams] = useState<FilterOptions>({
    tipo_veiculo: 'C',
    tipo_venda: 'C',
    ordenacao: '',
    ano: {
      min: undefined,
      max: undefined,
    },
  });

  const [filterValues, setFilterValues] = useState<
    FiltersState['filterValues']
  >({
    year: { min: 0, max: 0 },
    price: { min: 0, max: 0 },
    km: { min: 0, max: 0 },
    transmissionType: [],
    version: '',
    vehicleCurrentStateOption: ['U'],
    fuelType: [],
    doorsQt: [],
    colors: [],
    optionals: [],
    states: [],
    cities: [],
    brands: [],
    models: [],
    tiposCambio: [],
    tiposCombustivel: [],
    ordering: '',
  });

  const [search, setSearch] = useState<FiltersState['search']>({
    colors: '',
    state: '',
    city: '',
    brand: '',
    model: '',
  });

  // UseQuery hooks
  const {
    data: colorsData,
    isLoading: isColorsLoading,
    error: colorsErrors,
  } = useQuery({ queryKey: ['colors'], queryFn: () => getColors() });

  const {
    data: stateData,
    isLoading: isStatesLoading,
    error: statesErrors,
  } = useQuery({ queryKey: ['states'], queryFn: () => getState(search.state) });

  const {
    data: cityData,
    isLoading: isCitiesLoading,
    error: citiesErrors,
  } = useQuery({ queryKey: ['cities'], queryFn: () => getCity(search.city) });

  const {
    data: brandsData,
    isLoading: isBrandsLoading,
    error: brandsError,
  } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands(search.brand),
  });

  const {
    data: modelsData,
    isLoading: isModelsLoading,
    error: modelsError,
  } = useQuery({
    queryKey: ['models'],
    queryFn: () => getModels(search.model),
  });

  // Novas queries para filtros
  const {
    data: tiposCambioData,
    isLoading: isTiposCambioLoading,
    error: tiposCambioError,
  } = useQuery({
    queryKey: ['tipos-cambio'],
    queryFn: () => getTiposCambio(),
  });

  const {
    data: tiposCombustivelData,
    isLoading: isTiposCombustivelLoading,
    error: tiposCombustivelError,
  } = useQuery({
    queryKey: ['tipos-combustivel'],
    queryFn: () => getTiposCombustivel(),
  });

  const {
    data: opcionaisData,
    isLoading: isOpcionaisLoading,
    error: opcionaisError,
  } = useQuery({
    queryKey: ['opcionais'],
    queryFn: () => getOpcionais(),
  });

  // Removidas queries para rotas que não existem na API

  const filterKey = useMemo(() => JSON.stringify(filterParams), [filterParams]);
  const {
    data: searchResults,
    isLoading: isSearchResultsLoading,
    error: searchResultsErrors,
    refetch: refetchSearchResults,
    isRefetching,
  } = useQuery({
    queryKey: ['search-results', filterKey],
    queryFn: ({ queryKey }) => {
      const parsedParams = JSON.parse(queryKey[1]);
      console.log('Buscando com filtros:', parsedParams);
      return getFilteredData(parsedParams);
    },
    enabled: true, // Mudado para true para executar automaticamente
  });

  // Nova query para buscar dados de filtros com contagem
  const {
    data: filterDataWithCount,
    isLoading: isFilterDataLoading,
    error: filterDataErrors,
    refetch: refetchFilterData,
    isRefetching: isFilterDataRefetching,
  } = useQuery({
    queryKey: ['filter-data-with-count', filterKey],
    queryFn: ({ queryKey }) => {
      const parsedParams = JSON.parse(queryKey[1]);
      console.log('Buscando dados de filtros com contagem:', parsedParams);
      return getFilterDataWithCount(parsedParams);
    },
    enabled: true,
  });

  // Carrega todos os anúncios ao iniciar
  useEffect(() => {
    console.log('FiltersContext inicializado - carregando anúncios iniciais');
  }, []);

  const {
    data: transferSearchResults,
    isLoading: isTransferSearchResultsLoading,
    error: transferSearchResultsErrors,
    refetch: refetchTransferSearchResults,
    isRefetching: isTransferSearchResultsRefetching,
  } = useQuery({
    queryKey: ['search-results', filterParams + 'transfers'],
    queryFn: () => getFilteredData({ ...filterParams, tipo_venda: 'R' }),
  });

  useEffect(() => {
    if (colorsData)
      setFilterValues((prev) => ({ ...prev, colors: colorsData }));
    if (stateData) setFilterValues((prev) => ({ ...prev, states: stateData }));
    if (cityData) setFilterValues((prev) => ({ ...prev, cities: cityData }));
    if (brandsData)
      setFilterValues((prev) => ({ ...prev, brands: brandsData }));
    if (modelsData)
      setFilterValues((prev) => ({ ...prev, models: modelsData }));
    if (tiposCambioData)
      setFilterValues((prev) => ({ ...prev, tiposCambio: tiposCambioData }));
    if (tiposCombustivelData)
      setFilterValues((prev) => ({ ...prev, tiposCombustivel: tiposCombustivelData }));
    if (opcionaisData)
      setFilterValues((prev) => ({ ...prev, opcionais: opcionaisData }));
  }, [colorsData, stateData, cityData, brandsData, modelsData, tiposCambioData, tiposCombustivelData, opcionaisData]);

  const isDataLoaded = () =>
    !isColorsLoading &&
    !isStatesLoading &&
    !isCitiesLoading &&
    !isSearchResultsLoading &&
    !isBrandsLoading &&
    !isModelsLoading &&
    !isTiposCambioLoading &&
    !isTiposCombustivelLoading &&
    !isOpcionaisLoading;

  useEffect(() => {
    const errors = {
      colorsErrors,
      statesErrors,
      citiesErrors,
      searchResultsErrors,
      brandsError,
      modelsError,
      tiposCambioError,
      tiposCombustivelError,
      opcionaisError,
    };

    if (Object.values(errors).some((value) => value !== null)) {
      console.warn('Errors detected: ', errors);
    }
  }, [
    colorsErrors,
    statesErrors,
    citiesErrors,
    searchResultsErrors,
    brandsError,
    modelsError,
    tiposCambioError,
    tiposCombustivelError,
    opcionaisError,
  ]);

  const resetFilters = (tipoVenda: 'R' | 'C' | undefined) => {
    setFilterParams({
      ano: { min: undefined, max: undefined },
      marca: undefined,
      ordenacao: '',
      id_cidade: undefined,
      id_estado: undefined,
      valor: undefined,
      cor: undefined,
      cores: undefined,
      tipos_combustivel: undefined,
      modelo: undefined,
      id_marca: undefined,
      tipos_cambio: undefined,
      tipo_veiculo: undefined,
      num_portas: undefined,
      opcionais: undefined,
      quilometragem: undefined,
      status_veiculo: undefined,
      tipo_venda: tipoVenda || undefined,
    });
  };

  return (
    <FiltersContext.Provider
      value={{
        resetFilters,
        filterParams,
        error,
        isLoading,
        filterValues,
        setFilterParams,
        search,
        setFilterValues,
        setSearch,
        searchResults,
        refetchSearchResults,
        isSearchResultsLoading,
        isRefetching,
        isTransferSearchResultsLoading,
        transferSearchResultsErrors,
        refetchTransferSearchResults,
        isTransferSearchResultsRefetching,
        transferSearchResults,
        filterDataWithCount,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
