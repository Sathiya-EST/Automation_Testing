import { FC } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { MessageCircleQuestion } from 'lucide-react';

interface TooltipButtonProps {
    tooltipContent: string; // The content of the tooltip
    ariaLabel?: string;
}

const FieldInfoButton: FC<TooltipButtonProps> = ({ tooltipContent, ariaLabel = "Help information" }) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-white rounded-full border shadow-sm p-1 
                            text-gray-400 hover:text-gray-600 transition-all opacity-0 invisible
                            group-hover:opacity-100 group-hover:visible
                            group-focus-within:opacity-100 group-focus-within:visible"
                        aria-label={ariaLabel}
                    >
                        <MessageCircleQuestion className="h-3.5 w-3.5" />
                    </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs" side="left">
                    {tooltipContent}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default FieldInfoButton;
