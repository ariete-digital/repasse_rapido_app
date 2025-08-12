import { AntDesign } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { FlatList, Text } from 'react-native'

import TextInput from '@components/TextInput'
import { api } from '@lib/api'
import * as A from './styles'

interface DataProps {
  value: number
  label: string
}

export interface RequestProps {
  content: DataProps[]
}

interface Props {
  label: string
  onChangeValue: (value: number) => void
  errorMessage?: string
  filter: 'cidades' | 'estados' | 'modelos' | 'marcas'
}

const AutocompleteDropdown = ({
  label,
  onChangeValue,
  errorMessage,
  filter,
}: Props) => {
  const [query, setQuery] = useState('')
  const [data, setData] = useState<DataProps[]>([])
  const [selected, setSelected] = useState<DataProps | undefined>()

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query.length > 2) {
        api
          .get<RequestProps>(`/cliente/listagem/${filter}?filtro=${query}`)
          .then((res) => {
            const { content } = res.data
            if (content) {
              setData(content)
            }
          })
          .catch((error) => console.error('Error fetching data:', error))
      } else {
        setData([])
      }
    }, 300)

    return () => clearTimeout(debounceTimeout)
  }, [query])

  const handleSelect = (item: DataProps) => {
    setSelected(item)
    onChangeValue(item.value)
    setQuery(item.label)
  }

  const handleClear = () => {
    setSelected(undefined)
    setQuery('')
  }

  return (
    <A.Container>
      <A.SelectableContainer>
        <TextInput
          label={label}
          value={query}
          onChangeText={(text) => setQuery(text)}
          errorMessage={errorMessage}
        />
        {!!selected && (
          <A.ClearButton onPress={handleClear}>
            <AntDesign name="closecircleo" size={18} color="black" />
          </A.ClearButton>
        )}
      </A.SelectableContainer>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <A.SelectableItem onPress={() => handleSelect(item)}>
            <Text>{item.label}</Text>
          </A.SelectableItem>
        )}
        keyExtractor={(item) => item.value.toString()}
        style={{
          paddingTop: 10,
        }}
      />
    </A.Container>
  )
}

export default AutocompleteDropdown
