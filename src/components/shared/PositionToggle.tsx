// import React, { useState } from 'react';
// import {
//     ArrowLeft,
//     ArrowRight,
//     Layers,
//     SplitSquareVertical
// } from 'lucide-react';

// interface BeforeAfterToggleProps {
//     value: 'BEFORE' | 'AFTER' | null;
//     onChange: (value: 'BEFORE' | 'AFTER') => void;
//     className?: string;
// }

// const BeforeAfterToggle: React.FC<BeforeAfterToggleProps> = ({
//     value,
//     onChange,
//     className = ''
// }) => {
//     const handleToggle = () => {
//         const newValue = value === 'BEFORE' ? 'AFTER' : 'BEFORE';
//         onChange(newValue);
//     };

//     return (
//         <div
//             className={`
//                 relative 
//                 inline-flex 
//                 items-center 
//                 border 
//                 border-gray-200 
//                 rounded-lg 
//                 overflow-hidden 
//                 cursor-pointer 
//                 select-none
//                 transition-all 
//                 duration-300 
//                 ${className}
//             `}
//             onClick={handleToggle}
//         >
//             {/* Background Slider */}
//             <div
//                 className={`
//                     absolute 
//                     left-0 
//                     top-0 
//                     bottom-0 
//                     w-1/2 
//                     bg-primary 
//                     transition-transform 
//                     duration-300 
//                     ${value === 'AFTER' ? 'translate-x-full' : ''}
//                 `}
//             />

//             {/* Before Option */}
//             <div
//                 className={`
//                     relative 
//                     z-10 
//                     px-4 
//                     py-2 
//                     flex 
//                     items-center 
//                     space-x-2 
//                     transition-colors 
//                     ${value === 'BEFORE' ? 'text-white' : 'text-gray-700'}
//                 `}
//             >
//                 <ArrowLeft className="h-5 w-5" />
//                 <span className="text-sm font-medium">Before</span>
//             </div>

//             {/* After Option */}
//             <div
//                 className={`
//                     relative 
//                     z-10 
//                     px-4 
//                     py-2 
//                     flex 
//                     items-center 
//                     space-x-2 
//                     transition-colors 
//                     ${value === 'AFTER' ? 'text-white' : 'text-gray-700'}
//                 `}
//             >
//                 <span className="text-sm font-medium">After</span>
//                 <ArrowRight className="h-5 w-5" />
//             </div>
//         </div>
//     );
// };

// // Example Usage Component
// const BeforeAfterToggleShowcase: React.FC = () => {
//     const [toggleValue, setToggleValue] = useState<'BEFORE' | 'AFTER'>('BEFORE');

//     return (
//         <div className="p-6 bg-muted flex flex-col items-center space-y-4">
//             <BeforeAfterToggle
//                 value={toggleValue}
//                 onChange={setToggleValue}
//                 className="shadow-md hover:shadow-lg"
//             />
//             <div className="text-center">
//                 <p>Current State: <span className="font-bold">{toggleValue}</span></p>
//             </div>
//         </div>
//     );
// };

// export { BeforeAfterToggle, BeforeAfterToggleShowcase };

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Layers, SplitSquareVertical } from 'lucide-react';

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
    const handleToggle = () => {
        // If value is null or 'BEFORE', switch to 'AFTER', else switch to 'BEFORE'
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
                    ${value === 'BEFORE' || value === null ? 'text-white' : 'text-gray-700'}
                `}
            >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Before</span>
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
                    ${value === 'AFTER' ? 'text-white' : 'text-gray-700'}
                `}
            >
                <span className="text-sm font-medium">After</span>
                <ArrowRight className="h-5 w-5" />
            </div>
        </div>
    );
};

// Example Usage Component
const BeforeAfterToggleShowcase: React.FC = () => {
    const [toggleValue, setToggleValue] = useState<'BEFORE' | 'AFTER' | null>(null);

    return (
        <div className="p-6 bg-muted flex flex-col items-center space-y-4">
            <BeforeAfterToggle
                value={toggleValue}
                onChange={setToggleValue}
                className="shadow-md hover:shadow-lg"
            />
            <div className="text-center">
                <p>Current State: <span className="font-bold">{toggleValue ?? 'None'}</span></p>
            </div>
        </div>
    );
};

export { BeforeAfterToggle, BeforeAfterToggleShowcase };
