import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  color?: string;
  width?: number;
  height?: number;
}

const MenuTabIcon: React.FC<Props> = ({ color = '#040707', width = 28, height = 28 }) => (
  <Svg width={width} height={height} viewBox="0 0 19 18" fill="none">
    <Path d="M15.875 12.375V13.125H3.125V12.375H15.875ZM15.875 8.625V9.375H3.125V8.625H15.875ZM15.875 4.875V5.625H3.125V4.875H15.875Z" fill={color} stroke={color} strokeWidth={0.75}/>
  </Svg>
);

export default MenuTabIcon; 