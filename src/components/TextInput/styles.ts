import styled from 'styled-components/native';

export const TextContainer = styled.View`
  width: 100%;
  margin: 0 auto;
  gap: 10px;
`;

export const InputLabel = styled.Text`
  margin-top: 8px;
  font-family: 'MontserratRegular';
`;

export const InputContainer = styled.View`
  position: relative;
`;

export const Input = styled.TextInput<{ errorMessage?: boolean }>`
  background-color: #F3F2ED;
  border-radius: 8px;
  width: 100%;
  height: 40px;
  padding: 10px;
  border: ${(props) =>
    !!props.errorMessage ? '1px solid red' : '1px solid transparent'};
`;

export const ErrorLabel = styled.Text`
  color: ${(props) => props.theme.colors['red']};
  margin-top: -8px;
  font-size: 10px;
`;

export const ShowPasswordButton = styled.TouchableOpacity`
  position: absolute;
  top: 20%;
  right: 10px;
`;
