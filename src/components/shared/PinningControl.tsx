import React from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, PinOff } from 'lucide-react';

interface PinningControlsProps {
  column: {
    getIsPinned: () => 'left' | 'right' | false;
    getCanPin: () => boolean;
    pin: (position: 'left' | 'right' | false) => void;
  };
}

const PinningControls: React.FC<PinningControlsProps> = ({ column }) => {
  const isPinned = column.getIsPinned();

  if (!column.getCanPin()) {
    return null; 
  }

  return (
    <div className="ml-2 justify-center flex gap-1 group-hover:flex group-hover:gap-1 transition-opacity duration-300">
      {isPinned !== 'left' && (
        <Button
          variant="ghost"
          onClick={() => column.pin('left')}
          className="w-6 h-6 hover:bg-primary hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {isPinned && (
        <Button
          variant="ghost"
          onClick={() => column.pin(false)}
          className="w-6 h-6 hover:bg-primary hover:text-white"
        >
          <PinOff className="h-4 w-4" />
        </Button>
      )}
      {isPinned !== 'right' && (
        <Button
          variant="ghost"
          onClick={() => column.pin('right')}
          className="w-6 h-6 hover:bg-primary hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default PinningControls;
