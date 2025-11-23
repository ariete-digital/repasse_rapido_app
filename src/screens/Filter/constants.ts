import {
  Calendar,
  Car,
  CarTime,
  Door,
  Gas,
  Location,
  Oil,
  Options,
  Price,
  Speedometer,
  Transmission,
} from '@icons/index';
import { ImageSourcePropType } from 'react-native';

interface Item {
  icon: ImageSourcePropType;
  label: string;
  filterName: string;
}

export const items: Item[] = [

  {
    icon: Location,
    label: 'Localização',
    filterName: 'location',
  },
  {
    icon: Car,
    label: 'Marca',
    filterName: 'brands',
  },
  {
    icon: Car,
    label: 'Modelo',
    filterName: 'models',
  },
  {
    icon: Car,
    label: 'Versão',
    filterName: 'version',
  },

  {
    icon: Calendar,
    label: 'Ano',
    filterName: 'year',
  },
  {
    icon: Price,
    label: 'Valor',
    filterName: 'price',
  },

  {
    icon: Transmission,
    label: 'Câmbio',
    filterName: 'transmissionType',
  },

];
