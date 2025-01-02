import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Flex from './Flex';

interface InfoAlertProps {
    icon?: any;
    title: string;
    desc: string;
}

const InfoAlert: React.FC<InfoAlertProps> = ({
    icon: Icon = AlertTriangle,
    title,
    desc
}) => {
    return (
        <Flex className="justify-start items-center alert border border-gray-400 rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800 mt-1">
            <Icon className="h-4 w-4 text-gray-500" />
            <div className="alert-content flex-1 px-2">
                <h3 className="alert-title font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
                <p className="alert-description text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
        </Flex>

    );
};

export default InfoAlert;
