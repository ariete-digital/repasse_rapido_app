import styled from 'styled-components/native'

export const Container = styled.View`
  flex-direction: column;
  z-index: 10;
`

export const ClearButton = styled.TouchableOpacity`
  z-index: 10;
  position: absolute;
  right: 1px;
  top: 34px;
  padding: 10px;
`

export const SelectableContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

export const SelectableItem = styled.TouchableOpacity`
  margin-bottom: 5px;
  background-color: ${(props) => props.theme.colors['gray-200']};
  padding: 10px;
  border-radius: 4px;
`
