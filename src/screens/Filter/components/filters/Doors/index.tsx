import Checkbox from "expo-checkbox";
import { useState } from "react";
import { View } from "react-native";

import Text from "@components/Text";
import { useFilters } from "@hooks/useFilters";
import { theme } from "@theme/GlobalStyles";
import BaseFilterModal from "../../BaseFilter";

interface DoorsFilterProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const DoorsFilter = ({
  isVisible,
  handleCancel,
  handleConfirm,
}: DoorsFilterProps) => {
  const { filterParams, setFilterParams, isLoading } = useFilters();
  const [doorsQtt, setDoorsQtt] = useState<number[]>(filterParams.num_portas || []);

  const handleToggle = (value: number) => {
    setDoorsQtt((prevDoorsQtt) => {
      if (prevDoorsQtt.includes(value)) {
        return prevDoorsQtt.filter((item) => item !== value);
      } else {
        return [...prevDoorsQtt, value];
      }
    });
  };

  const handleSubmit = () => {
    setFilterParams({ ...filterParams, num_portas: doorsQtt });
    handleConfirm();
  };

  const options: number[] = [2, 3, 4, 5];

  return (
    <BaseFilterModal
      title="Quantidade de portas"
      isLoading={isLoading}
      visible={isVisible}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      render={() => {
        return (
          <View style={{ gap: 15, marginVertical: 15 }}>
            {options.map((value) => (
              <View
                key={value}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 5,
                }}
              >
                <Checkbox
                  disabled={false}
                  value={doorsQtt.includes(value)}
                  onValueChange={() => handleToggle(value)}
                  color={theme.colors["brand-blue"]}
                />
                <Text color="black-700">{value} Portas</Text>
              </View>
            ))}
          </View>
        );
      }}
    />
  );
};

export default DoorsFilter;
