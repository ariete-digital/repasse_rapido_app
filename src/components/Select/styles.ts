import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
`;

export const SelectButton = styled.TouchableOpacity<{ hasError?: boolean; disabled?: boolean }>`
  background-color: ${({ disabled }) => disabled ? '#F5F5F5' : '#F1F4F9'};
  border-radius: 8px;
  padding: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: ${({ hasError }) => hasError ? '1px' : '0px'};
  border-color: ${({ hasError }) => hasError ? '#E11138' : 'transparent'};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
`;

export const SelectText = styled.Text<{ disabled?: boolean }>`
  font-size: 14px;
  font-weight: bold;
  color: ${({ disabled }) => disabled ? '#9CA3AF' : '#000'};
`;

export const ArrowText = styled.Text<{ disabled?: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${({ disabled }) => disabled ? '#9CA3AF' : '#000'};
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #E11138;
  margin-top: 4px;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding-horizontal: 20px;
`;

export const ModalContent = styled.View`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-height: 70%;
`;

export const ModalTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
  text-align: center;
`;

export const OptionItem = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #F1F4F9;
  background-color: ${({ selected }) => selected ? '#F1F4F9' : 'transparent'};
`;

export const OptionText = styled.Text<{ selected?: boolean }>`
  font-size: 14px;
  color: ${({ selected }) => selected ? '#9A0B26' : '#000'};
`;

export const CancelButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 12px;
  background-color: #F1F4F9;
  border-radius: 8px;
  align-items: center;
`;

export const CancelButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #000;
`;
