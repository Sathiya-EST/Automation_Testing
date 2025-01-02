import React from 'react';

type TextVariant = 'body' | 'heading' | 'caption' | 'title'; // Added 'title' variant
type TextSize = 'small' | 'medium' | 'large';
type TextColor = 'default' | 'primary' | 'secondary' | 'danger';

interface TextProps {
    variant?: TextVariant;
    size?: TextSize;
    color?: TextColor;
    children: React.ReactNode;
    className?: string;
}

const Text: React.FC<TextProps> = ({
    variant = 'body',
    size = 'medium',
    color = 'default',
    children,
    className = '',
}) => {
    const baseStyles = 'transition-all duration-200';

    const variantStyles = {
        body: 'font-normal',
        heading: 'font-bold',
        caption: 'font-light text-xs',
        title: 'font-semibold text-2xl',
    };

    const sizeStyles = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
    };

    const colorStyles = {
        default: 'text-gray-800 dark:text-gray-200',
        primary: 'text-blue-600 dark:text-blue-400',
        secondary: 'text-green-600 dark:text-green-400',
        danger: 'text-red-600 dark:text-red-400',
    };

    const combinedStyles = variant === 'title' ? "title" : `${className} ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${colorStyles[color]}`;

    return <span className={combinedStyles}>{children}</span>;
};

export default Text;
