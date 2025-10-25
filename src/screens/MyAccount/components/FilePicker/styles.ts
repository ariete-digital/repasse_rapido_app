import Text from '@components/Text'
import styled from 'styled-components/native'

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
`

export const PickerBTN = styled.TouchableOpacity`
  width: 100px;
  height: 40px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  background-color: gray;
  border-radius: 4px;
`

export const ImagePathContainer = styled.View`
  height: 40px;
  border: 1px solid ${(props) => props.theme.colors['gray-300']};
  padding: 10px;
  border-radius: 4px;
  flex: 1;
  background-color: ${(props) => props.theme.colors['gray-100']};
`
export const ImagePathLabel = styled(Text)``
