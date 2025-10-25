import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const CameraIcon: React.FC<IconProps> = ({ size = 24, color = '#000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15.2c1.77 0 3.2-1.43 3.2-3.2s-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2 1.43 3.2 3.2 3.2zm0-4.8c.88 0 1.6.72 1.6 1.6s-.72 1.6-1.6 1.6-1.6-.72-1.6-1.6.72-1.6 1.6-1.6z"
        fill={color}
      />
      <Path
        d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
        fill={color}
      />
    </Svg>
  );
};

export default CameraIcon;

