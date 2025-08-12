import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import Text from '@components/Text';
import { useFilters } from '@hooks/useFilters';
import BaseFilterModal from '../../BaseFilter';

interface OrderFilterProps {
  isVisible: boolean;
  handleConfirm: () => void;
  handleCancel: () => void;
}

const OrderFilter = ({
  isVisible,
  handleConfirm,
  handleCancel,
}: OrderFilterProps) => {
  const { filterParams, setFilterParams, isLoading, refetchSearchResults } =
    useFilters();
  const [orderingFilter, setOrderingFilter] = useState<string>();

  const handleSubmit = () => {
    if (orderingFilter) {
      setFilterParams({ ...filterParams, ordenacao: orderingFilter });
      handleConfirm();
    }
  };

  const handleClick = (value: '' | 'P' | 'N' | 'A' | 'K') => {
    setOrderingFilter(value);
  };

  return (
    <BaseFilterModal
      title="Ordenar os anúncios por"
      isLoading={isLoading}
      visible={isVisible}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      render={() => {
        return (
          <View style={{ marginVertical: 16, gap: 16 }}>
            <TouchableOpacity 
              onPress={() => handleClick('P')}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}
            >
              <Text color="black">
                Maior Preço
              </Text>
              {orderingFilter === 'P' && (
                <Text color="black">✔️</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleClick('N')}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}
            >
              <Text color="black">
                Menor Preço
              </Text>
              {orderingFilter === 'N' && (
                <Text color="black">✔️</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleClick('A')}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}
            >
              <Text color="black">
                Ano mais novo
              </Text>
              {orderingFilter === 'A' && (
                <Text color="black">✔️</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleClick('K')}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}
            >
              <Text color="black">
                Menor KM
              </Text>
              {orderingFilter === 'K' && (
                <Text color="black">✔️</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
};

export default OrderFilter;
