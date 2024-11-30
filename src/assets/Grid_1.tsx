import React from 'react';

interface IconProps {

  className?: string;
  fillColorclass?: string;
}

const Grid1Layout: React.FC<IconProps> = ({

  className = 'fill-gray-400',
  fillColorclass = 'fill-gray-900',
}) => {
  return (
    <svg
      width="44"
      height="48"
      viewBox="0 0 44 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="0.5" y="0.5" width="43" height="47" rx="5.5" />
      <rect x="0.5" y="0.5" width="43" height="47" rx="5.5"  />
      <rect x="5" y="8" width="34" height="4" rx="2" className={fillColorclass}/>
      <rect x="5" y="17" width="34" height="4" rx="2" className={fillColorclass}/>
      <rect x="5" y="26" width="34" height="4" rx="2" className={fillColorclass}/>
      <rect x="5" y="35" width="34" height="4" rx="2" className={fillColorclass}/>
    </svg>
  );
};

export default Grid1Layout;
