import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Check, CircleDot, Circle, LucideIcon } from "lucide-react";

// Define status type
export type StatusValue = 'published' | 'unPublished';

// Define status option interface
interface StatusOption {
  value: StatusValue;
  label: string;
  colorClass: string;
  icon: LucideIcon;
}

// Component props interface
interface StatusFilterDropdownProps {
  onFilterChange?: (status: StatusValue) => void;
  initialStatus?: StatusValue | null;
  className?: string;
}

const StatusFilterDropdown: React.FC<StatusFilterDropdownProps> = ({ 
  onFilterChange, 
  initialStatus = null,
  className = ''
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState<StatusValue | null>(initialStatus);

  const statusOptions: StatusOption[] = [
    { 
      value: 'published', 
      label: 'Published', 
      colorClass: 'bg-green-100 text-green-700',
      icon: CircleDot
    },
    { 
      value: 'unPublished', 
      label: 'Unpublished', 
      colorClass: 'bg-red-100 text-red-700',
      icon: Circle
    }
  ];

  const handleStatusChange = (status: StatusValue) => {
    setSelectedStatus(status);
    onFilterChange?.(status);
  };

  return (
    <Select 
      value={selectedStatus || undefined}
      onValueChange={handleStatusChange}
    >
      <SelectTrigger className={`w-[240px] shadow-sm ${className}`}>
        <SelectValue placeholder="Select Status">
          {selectedStatus && (() => {
            const status = statusOptions.find(s => s.value === selectedStatus);
            if (!status) return null;
            
            const Icon = status.icon;
            return (
              <div className="flex items-center">
                <Icon className={`w-4 h-4 mr-2 ${status.colorClass.split(' ')[1]}`} />
                {status.label}
              </div>
            );
          })()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => {
          const Icon = status.icon;
          return (
            <SelectItem 
              key={status.value} 
              value={status.value}
              className="cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Icon className={`w-4 h-4 mr-2 ${status.colorClass.split(' ')[1]}`} />
                  <span className={status.colorClass.split(' ')[1]}>
                    {status.label}
                  </span>
                </div>
                {/* {selectedStatus === status.value && (
                  <Check className="w-4 h-4 text-primary" />
                )} */}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default StatusFilterDropdown;