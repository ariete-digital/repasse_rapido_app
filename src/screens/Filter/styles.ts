import styled from 'styled-components/native'

export const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.colors['white']};
  flex: 1;
`

// Item
export const Item = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-top-color: ${(props) => props.theme.colors['gray-300']};
  border-top-width: 0.5px;
  border-bottom-color: ${(props) => props.theme.colors['gray-300']};
  border-bottom-width: 0.5px;
  padding: 20px;
  padding-left: 30px;
  gap: 10px;
`

export const Icon = styled.Image`
  width: 25px;
  height: 25px;
`

export const ButtonContainer = styled.View`
  width: 100%;
  padding: 20px 5%;
  align-items: center;
  justify-content: center;
`
