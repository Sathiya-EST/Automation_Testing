import React from 'react';

interface TextProps {
  children: React.ReactNode;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const Text: React.FC<TextProps> = ({ children, color = 'black', size = 'medium' }) => {
  const fontSize = size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px';

  return (
    <p style={{ color, fontSize }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {children}
    </p>
  );
};

export default Text;
