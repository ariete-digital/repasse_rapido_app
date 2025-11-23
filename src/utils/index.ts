import { Linking, StyleSheet } from 'react-native';
import { TFontFamily } from './types';

export const fontFamilyConversion = ({ type, weight }: TFontFamily) =>
  type === 'p' || type === 'c'
    ? `Montserrat${capitalizeFirstLetter(weight)}`
    : 'Cabin';

const capitalizeFirstLetter = (letter: string) =>
  letter.charAt(0).toUpperCase() + letter.slice(1);

export const styleBuilder = (fontStyle: string) => {
  const [type, size, weight] = fontStyle.split('-');

  return `
      font-size: ${size}px; 
      font-family: ${fontFamilyConversion({ type, weight })};
    `;
};

export const currencyFormat = (price: string) => {
  const formattedNumber = parseFloat(price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return `${formattedNumber}`;
};

export const shadow = StyleSheet.create({
  default: {
    shadowColor: '#0000001a',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  services: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 15,
  },
});

export const openUrl = (url: string) => Linking.openURL(url);
export const canOpenURL = (url: string) => Linking.canOpenURL(url);

export function formatarTelefone(input: string) {
  
  const numeros = input.replace(/\D/g, '');

  if (numeros.length >= 11) {
    return numeros.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (numeros.length >= 10) {
    
    return numeros.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
  } else {
    
    return numeros;
  }
}
