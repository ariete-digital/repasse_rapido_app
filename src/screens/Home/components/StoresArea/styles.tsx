import styled from 'styled-components/native';
import { Image } from 'expo-image';

export const StoreLogos = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Pressable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  width: fit-content;
`;

export const SafeImage = ({ uri, ...props }: { uri?: string } & any) => {
  const validSource = typeof uri === 'string' && uri.trim() !== '' ? uri : null;

  return validSource ? <Image source={validSource} {...props} /> : null;
};

export const StoreLogo = styled(Image)`
  width: 100px;
  height: 100px;
  margin: 10px;
  border-radius: 6px; // opcional
`;
