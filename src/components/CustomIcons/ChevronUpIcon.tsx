import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const ChevronUpIcon: React.FC<IconProps> = ({ size = 24, color = '#000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
        fill={color}
      />
    </Svg>
  );
};

export default ChevronUpIcon;

