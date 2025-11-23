import styled from 'styled-components/native';
import { theme } from '@theme/GlobalStyles';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${theme.colors['clear-white']};
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

export const CarIcon = styled.Image`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-family: 'MontserratBold';
  color: ${theme.colors.black};
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 20px;
`;

export const MainTitle = styled.Text`
  font-size: 24px;
  font-family: 'MontserratBold';
  color: ${theme.colors.black};
  text-align: center;
  margin-bottom: 16px;
`;

export const Description = styled.Text`
  font-size: 16px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
  text-align: center;
  line-height: 22px;
`;

export const ButtonContainer = styled.View`
  padding-bottom: 20px;
`;

export const StartButton = styled.TouchableOpacity`
  background-color: ${theme.colors['brand-red']};
  padding: 16px;
  border-radius: 8px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: ${theme.colors.white};
  font-size: 16px;
  font-family: 'MontserratBold';
`;

export const ProgressContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

export const ProgressStep = styled.View<{ active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => props.active ? theme.colors['brand-red'] : theme.colors['gray-200']};
  justify-content: center;
  align-items: center;
  margin-horizontal: 4px;
`;

export const ProgressStepText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-family: 'MontserratBold';
  color: ${props => props.active ? theme.colors.white : theme.colors.black};
`;

export const FormContainer = styled.ScrollView`
  flex: 1;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-family: 'MontserratBold';
  color: ${theme.colors.black};
  margin-bottom: 20px;
`;

export const FormField = styled.View`
  margin-bottom: 20px;
`;

export const FieldLabel = styled.Text`
  font-size: 14px;
  font-family: 'MontserratMedium';
  color: ${theme.colors.black};
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  background-color: ${theme.colors['gray-200']};
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
`;

export const SelectInput = styled.TouchableOpacity`
  background-color: ${theme.colors['gray-200']};
  border-radius: 8px;
  padding: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SelectText = styled.Text`
  font-size: 14px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
`;

export const SelectArrow = styled.Text`
  font-size: 16px;
  color: ${theme.colors.black};
`;

export const OptionsContainer = styled.View`
  margin-bottom: 20px;
`;

export const OptionsSummary = styled.TouchableOpacity`
  background-color: ${theme.colors['gray-200']};
  border-radius: 8px;
  padding: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const OptionsText = styled.Text`
  font-size: 14px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
`;

export const PlusIcon = styled.Text`
  font-size: 18px;
  color: ${theme.colors.black};
  font-weight: bold;
`;

export const OptionsList = styled.View`
  margin-top: 16px;
`;

export const OptionItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors['gray-200']};
`;

export const Checkbox = styled.View<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border-width: 2px;
  border-color: ${theme.colors['brand-red']};
  background-color: ${props => props.checked ? theme.colors['brand-red'] : 'transparent'};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

export const CheckIcon = styled.Text`
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: bold;
`;

export const OptionText = styled.Text`
  flex: 1;
  font-size: 14px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
`;

export const ArrowIcon = styled.Text`
  font-size: 16px;
  color: ${theme.colors.black};
`;

export const PhotoGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const PhotoItem = styled.TouchableOpacity<{ large?: boolean }>`
  width: ${props => props.large ? '48%' : '30%'};
  aspect-ratio: 1;
  background-color: ${theme.colors['gray-200']};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

export const PhotoAddText = styled.Text`
  font-size: 12px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
  margin-top: 4px;
`;

export const PhotoCounter = styled.View`
  background-color: ${theme.colors['gray-200']};
  border-radius: 8px;
  padding: 8px 16px;
  align-self: center;
  margin-bottom: 20px;
`;

export const PhotoCounterText = styled.Text`
  font-size: 12px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
`;

export const DescriptionInput = styled.TextInput`
  background-color: ${theme.colors['gray-200']};
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
  min-height: 120px;
  text-align-vertical: top;
`;

export const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

export const PriceLabel = styled.Text`
  font-size: 14px;
  font-family: 'MontserratMedium';
  color: ${theme.colors.black};
  margin-right: 8px;
`;

export const PriceInput = styled.TextInput`
  background-color: ${theme.colors['gray-200']};
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
  flex: 1;
`;

export const TermsContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const TermsCheckbox = styled.TouchableOpacity<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border-width: 2px;
  border-color: ${theme.colors['brand-red']};
  background-color: ${props => props.checked ? theme.colors['brand-red'] : 'transparent'};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  margin-top: 2px;
`;

export const TermsText = styled.Text`
  flex: 1;
  font-size: 14px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
  line-height: 20px;
`;

export const PlanContainer = styled.View`
  margin-bottom: 20px;
`;

export const PlanCard = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${theme.colors['gray-200']};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border-width: 2px;
  border-color: ${props => props.selected ? theme.colors['brand-red'] : 'transparent'};
`;

export const PlanTitle = styled.Text`
  font-size: 18px;
  font-family: 'MontserratBold';
  color: ${theme.colors['brand-red']};
  text-align: center;
  margin-bottom: 8px;
`;

export const PlanDescription = styled.Text`
  font-size: 14px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
  text-align: center;
  margin-bottom: 8px;
`;

export const PlanPrice = styled.Text`
  font-size: 24px;
  font-family: 'MontserratBold';
  color: ${theme.colors.black};
  text-align: center;
  margin-bottom: 16px;
`;

export const PlanSelectButton = styled.TouchableOpacity`
  background-color: ${theme.colors['brand-red']};
  border-radius: 8px;
  padding: 12px;
  align-items: center;
`;

export const PlanSelectText = styled.Text`
  color: ${theme.colors.white};
  font-size: 14px;
  font-family: 'MontserratBold';
`;

export const SuccessContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const SuccessIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border-width: 3px;
  border-color: ${theme.colors['brand-red']};
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

export const SuccessCheck = styled.Text`
  font-size: 40px;
  color: ${theme.colors['brand-red']};
  font-weight: bold;
`;

export const SuccessTitle = styled.Text`
  font-size: 20px;
  font-family: 'MontserratBold';
  color: ${theme.colors['brand-red']};
  text-align: center;
  margin-bottom: 12px;
`;

export const SuccessMessage = styled.Text`
  font-size: 14px;
  font-family: 'MontserratRegular';
  color: ${theme.colors.black};
  text-align: center;
  line-height: 20px;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 20px;
  margin: 20px;
  max-height: 80%;
  width: 90%;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-family: 'MontserratBold';
  color: ${theme.colors.black};
`;

export const ModalCloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const ModalCloseText = styled.Text`
  font-size: 24px;
  color: ${theme.colors.black};
`;

export const ModalContent = styled.ScrollView`
  flex: 1;
`;

export const ModalButton = styled.TouchableOpacity`
  background-color: ${theme.colors['brand-red']};
  border-radius: 8px;
  padding: 16px;
  align-items: center;
  margin-top: 20px;
`;

export const ModalButtonText = styled.Text`
  color: ${theme.colors.white};
  font-size: 16px;
  font-family: 'MontserratBold';
`;

