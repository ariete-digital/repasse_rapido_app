import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const ChevronDownIcon: React.FC<IconProps> = ({ size = 24, color = '#000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"
        fill={color}
      />
    </Svg>
  );
};

export default ChevronDownIcon;

