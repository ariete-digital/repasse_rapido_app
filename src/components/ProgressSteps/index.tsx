import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Color } from '../../theme/types';
import Text from '@components/Text';

export interface ProgressStepsProps {
  currentStep: number;
  totalSteps?: number;
  activeColor?: string;
  inactiveColor?: string;
  connectorColor?: string;
  size?: number;
  textColor?: Color['color'];
  connectorWidth?: number;
  containerStyle?: ViewStyle;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  totalSteps = 6,
  activeColor = '#9A0B26',
  inactiveColor = '#EBE8D9',
  connectorColor = '#EBE8D9',
  size = 22,
  textColor = 'white',
  connectorWidth = 10,
  containerStyle,
}) => {
  const stepsArray = Array.from({ length: totalSteps }, (_, idx) => idx + 1);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', ...(containerStyle || {}) }}>
      {stepsArray.map((step) => (
        <View
          key={step}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        >
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: step === currentStep ? activeColor : inactiveColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text fontStyle="p-14-bold" color={textColor}>
              {step}
            </Text>
          </View>
          {step !== totalSteps && (
            <View
              style={{
                width: connectorWidth,
                borderColor: connectorColor,
                borderWidth: 1,
              }}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default ProgressSteps;


