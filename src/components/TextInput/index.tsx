import { TextInputProps } from 'react-native';
import * as React from 'react';
import { EyeIcon, EyeOffIcon } from '@components/CustomIcons';
import * as I from './styles';

interface ITextInputProps extends TextInputProps {
  label?: string;
  control?: any;
  name?: string;
  errorMessage?: string | null;
  showPasswordButton?: boolean;
  onShowPasswordToggle?: () => void;
}

const TextInput = ({
  label,
  name = '',
  errorMessage,
  showPasswordButton = false,
  onShowPasswordToggle,
  ...props
}: ITextInputProps) => {
  return (
    <I.TextContainer>
      {label ? <I.InputLabel>{label}</I.InputLabel> : <I.InputLabel />}
      <I.InputContainer>
        <I.Input
          {...props}
          errorMessage={!!errorMessage}
          secureTextEntry={showPasswordButton && props.secureTextEntry}
        />
        {showPasswordButton && (
          <I.ShowPasswordButton onPress={onShowPasswordToggle}>
            {props.secureTextEntry ? (
              <EyeIcon size={24} color="black" />
            ) : (
              <EyeOffIcon size={24} color="black" />
            )}
          </I.ShowPasswordButton>
        )}
      </I.InputContainer>
      {!!errorMessage && <I.ErrorLabel>{errorMessage}</I.ErrorLabel>}
    </I.TextContainer>
  );
};

export default TextInput;
