import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BeforeAfterToggleProps {
    value: 'BEFORE' | 'AFTER' | null;
    onChange: (value: 'BEFORE' | 'AFTER') => void;
    className?: string;
}

const BeforeAfterToggle: React.FC<BeforeAfterToggleProps> = ({
    value,
    onChange,
    className = ''
}) => {
    const { t } = useTranslation()
    const handleToggle = () => {
        const newValue = value === 'AFTER' ? 'BEFORE' : 'AFTER';
        onChange(newValue);
    };

    return (
        <div
            className={`
                relative 
                inline-flex 
                items-center 
                border 
                border-gray-200 
                rounded-lg 
                overflow-hidden 
                cursor-pointer 
                select-none
                transition-all 
                duration-300 
                ${className}
            `}
            onClick={handleToggle}
        >
            {/* Background Slider */}
            <div
                className={`
                    absolute 
                    left-0 
                    top-0 
                    bottom-0 
                    w-1/2 
                    bg-primary 
                    transition-transform 
                    duration-300 
                    ${value === 'AFTER' ? 'translate-x-full' : ''}
                `}
            />

            {/* Before Option */}
            <div
                className={`
                    relative 
                    z-10 
                    px-4 
                    py-2 
                    flex 
                    items-center 
                    space-x-2 
                    transition-colors 
                    ${value === 'BEFORE' || value === null ? 'text-foreground' : 'text-gray-700 dark:text-gray-400'}
                `}
            >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">{t('master.form.update.position.before')}</span>
            </div>

            {/* After Option */}
            <div
                className={`
                    relative 
                    z-10 
                    px-4 
                    py-2 
                    flex 
                    items-center 
                    space-x-2 
                    transition-colors 
                    ${value === 'AFTER' ? 'text-foreground' : 'text-gray-700 dark:text-gray-500'}
                `}
            >
                <span className="text-sm font-medium">{t('master.form.update.position.after')}</span>
                <ArrowRight className="h-5 w-5" />
            </div>
        </div>
    );
};

export default BeforeAfterToggle