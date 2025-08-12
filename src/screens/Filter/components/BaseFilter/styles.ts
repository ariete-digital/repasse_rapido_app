import styled from 'styled-components/native';

export const Container = styled.Modal``;

export const ModalContainer = styled.View`
  background-color: #0a111d80;
  width: 100%;
  height: 100%;
  gap: 5px;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.View`
  background-color: ${(props) => props.theme.colors['white']};
  width: 75%;
  height: auto;
  align-items: flex-start;
  justify-content: space-around;
  border-radius: 8px;
  padding: 10px 20px;
`;

export const ModalTitle = styled.View``;

export const ModalBody = styled.View`
  width: 100%;
  padding: 10px 0;
`;
export const ModalFooter = styled.View`
  flex-direction: row;
  gap: 15px;
  justify-content: flex-end;
  width: 100%;
  z-index: -10;
`;

export const Pressable = styled.TouchableOpacity<{ bgColor?: string }>`
  background-color: ${(props) => props.bgColor ? props.theme.colors[props.bgColor] : 'transparent'};
  padding: 8px 16px;
  border-radius: 4px;
`;
