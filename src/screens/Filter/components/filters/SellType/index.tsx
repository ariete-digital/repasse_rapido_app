import Checkbox from "expo-checkbox";
import { useState } from "react";
import { View } from "react-native";

import Text from "@components/Text";
import { useFilters } from "@hooks/useFilters";
import { theme } from "@theme/GlobalStyles";
import BaseFilterModal from "../../BaseFilter";
import { Row } from "../styles";

interface SellTypeFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const SellTypeFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: SellTypeFilterProps) => {
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const initialSellType = filterParams.tipo_venda as 'C' | 'R';
  const [sellType, setSellType] = useState<'C' | 'R'>(initialSellType);

  const handleToggle = (field: 'C' | 'R') => {
    setSellType(field);
  };

  const handleSubmit = () => {
    setFilterParams({ ...filterParams, tipo_venda: sellType });
    handleConfirm();
  };

  const options: ('C' | 'R')[] = ['C', 'R'];

  return (
    <BaseFilterModal
      title="Tipo de Venda"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <Row style={{ marginVertical: 24 }}>
            {options.map((value) => (
              <View
                key={value}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 5,
                }}
              >
                <Checkbox
                  disabled={false}
                  value={sellType === value}
                  onValueChange={() => handleToggle(value)}
                  color={theme.colors["brand-blue"]}
                />
                <Text color="black-700">
                  {value === "C" ? "Consumidor" : "Repasse"}
                </Text>
              </View>
            ))}
          </Row>
        );
      }}
    />
  );
};

export default SellTypeFilter;
