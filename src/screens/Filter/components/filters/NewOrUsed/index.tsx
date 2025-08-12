import Checkbox from "expo-checkbox"
import { useState } from "react"
import { View } from "react-native"

import Text from "@components/Text"
import { useFilters } from "@hooks/useFilters"
import { theme } from "@theme/GlobalStyles"
import BaseFilterModal from "../../BaseFilter"
import { Row } from "../styles"

interface NewOrUsedFilterProps {
  isVisible: boolean
  handleCancel: () => void
  handleConfirm: () => void
}

const NewOrUsedFilter = ({ isVisible, handleCancel, handleConfirm }: NewOrUsedFilterProps) => {
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [vehicleStatus, setVehicleStatus] = useState<'U' | 'N'>(filterParams.status_veiculo)

  const handleToggle = (field: 'U' | 'N') => {
    setVehicleStatus(field)
  }

  const handleSubmit = () => {
    setFilterParams({ ...filterParams, status_veiculo: vehicleStatus });
    handleConfirm()
  };

  const options: ['U', 'N'] = ['U', 'N']

  return (
    <BaseFilterModal
      title="Qual veículo você busca"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <Row style={{ marginVertical: 24 }}>
            {options.map((value: 'U' | 'N') =>
              <View key={value} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5 }}>
                <Checkbox
                  disabled={false}
                  value={vehicleStatus === value}
                  onValueChange={() => handleToggle(value)}
                  color={theme.colors["brand-blue"]}
                />
                <Text color='black-700'>{value === 'U' ? 'Usado' : 'Novo'}</Text>
              </View>
            )
            }
          </Row>
        )
      }} />
  )
}

export default NewOrUsedFilter
