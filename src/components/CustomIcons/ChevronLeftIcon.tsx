import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const ChevronLeftIcon: React.FC<IconProps> = ({ size = 24, color = '#000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
        fill={color}
      />
    </Svg>
  );
};

export default ChevronLeftIcon;

