import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: #EFEEEA;
  border-radius: 12px;
  margin: 8px 30px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  padding: 5px;
  elevation: 3;
`;

export const ImageContainer = styled.View`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
`;

export const imageStyle = {
  width: '100%',
  height: '100%',
  resizeMode: 'cover' as const,
};

export const deleteIcon = {
  position: 'absolute' as const,
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 20,
  padding: 6,
};

export const editIcon = {
  position: 'absolute' as const,
  bottom: 8,
  left: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 16,
  padding: 8,
};

export const ContentContainer = styled.View`
  padding: 5px;
`;

export const VehicleInfo = styled.View`
  margin-bottom: 12px;
`;

export const AdInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ButtonsContainer = styled.View`
  flex-direction: row;
  flex: 1;
  width: 100%;
  justify-content: center;
  gap: 4px;
`;
