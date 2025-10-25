import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const theme = {
  colors: {
    'clear-white': '#ffffff',
    white: '#fcfcfc',
    red: '#DB504A',
    yellow: '#E3B505',
    'orange-text': "#CE7720",
    'brand-blue': '#001E47',
    'brand-red': '#E11138',
    'brand-red-dark': '#9A0B26',
    'gray-500': "#353535",
    'gray-300': '#DBE2EF',
    'gray-200': '#F1F4F9',
    'gray-100': '#F9F7F7',
    black: '#040707',
    'black-900': '#00040A',
    'black-800': '#030C1B',
    'black-700': '#0A111D',
    'black-600': '#12161E',
    'black-500': '#1A1E25',
    'black-400': '#272A30',
    'black-300': '#404348',
    'black-200': '#64676D',
    'black-100': '#A0A4AC',
    'gradient-1': ['#001E47', '#3F72AF', '#001E47'],
    'gradient-2': ['#001E47', ' #001E47', ' #3F72AF '],
  },
};

export const StyledThemeContainer = styled(SafeAreaView)`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors['clear-white']};
`;
