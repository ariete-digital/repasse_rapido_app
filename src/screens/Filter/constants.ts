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
  // {
  //   icon: Car,
  //   label: 'Carro ou Moto',
  //   filterName: 'vehicleType',
  // },
  // {
  //   icon: Car,
  //   label: 'Tipo de Venda',
  //   filterName: 'sellType',
  // },
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
  // {
  //   icon: CarTime,
  //   label: 'Novo ou Usado',
  //   filterName: 'vehicleCurrentState',
  // },
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
  // {
  //   icon: Speedometer,
  //   label: 'Quilometragem',
  //   filterName: 'km',
  // },
  {
    icon: Transmission,
    label: 'Câmbio',
    filterName: 'transmissionType',
  },
  // {
  //   icon: Gas,
  //   label: 'Combustível',
  //   filterName: 'fuelType',
  // },
  // {
  //   icon: Door,
  //   label: 'Portas',
  //   filterName: 'doorsQt',
  // },
  // {
  //   icon: Oil,
  //   label: 'Cor',
  //   filterName: 'colors',
  // },
  // {
  //   icon: Options,
  //   label: 'Opcionais',
  //   filterName: 'optionals',
  // },
];
