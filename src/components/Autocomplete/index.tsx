import React, { useState, useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import { api } from '@lib/api'
import TextInput from '@components/TextInput'
import * as A from './styles'
import { theme } from '@theme/GlobalStyles'
import { useToast } from 'react-native-toast-notifications'

export interface DataProps {
  value: number
  label: string
}

interface RequestProps {
  content: DataProps[]
}

interface Props {
  label: string
  onChangeValue: (value: string | DataProps) => void
  errorMessage?: string
  filter: 'modelos' | 'marcas' | 'estados' | 'cidades'
  placeholder: string
}

const AutocompleteDropdown = ({
  label,
  onChangeValue,
  errorMessage,
  filter,
  placeholder
}: Props) => {
  const [query, setQuery] = useState('')
  const [data, setData] = useState<DataProps[]>([])
  const [selected, setSelected] = useState<DataProps | undefined>()
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (query.length > 2) {
        try {
          const res = await api.get<RequestProps>(`/cliente/listagem/${filter}?filtro=${query}`)
          const { content } = res.data
          if (content) {
            setData(content)
          }
        } catch (error) {
          toast.show('Erro ao obter dados', { type: 'danger' })
        }
      } else {
        setData([])
      }
    }

    fetchData()
  }, [query])

  useEffect(() => {
    if (selected) {
      setQuery(selected.label)
    }
  }, [selected])

  const handleSelect = (item: DataProps) => {
    const returnValue = filter === "cidades" || filter === "estados" ? item : item.label
    setSelected(item);
    onChangeValue(returnValue);
    setQuery(item.label);
  };

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
          placeholder={placeholder}
          placeholderTextColor={theme.colors['black-600']}
        />
        {!!selected && (
          <A.ClearButton onPress={handleClear}>
            <AntDesign name="closecircleo" size={18} color="black" />
          </A.ClearButton>
        )}
      </A.SelectableContainer>
      <View
        style={{
          paddingTop: 10,
        }}
      >
        {data.map((item) => (
          <A.SelectableItem key={item.value.toString()} onPress={() => handleSelect(item)}>
            <Text>{item.label}</Text>
          </A.SelectableItem>
        ))}
      </View>
    </A.Container>
  )
}

export default AutocompleteDropdown
