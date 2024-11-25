import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="border-t-4 border-primary border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
    );
};

export default Spinner;
