import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";

interface ActionButtonProps {
    icon: React.ElementType;
    label: string;
    colorClass?: string;
    bgClass?: string;
    control: any;
    fieldName: string;
    onAccessChange?: (value: string) => void;
    className?: string;
}
const ActionButton: React.FC<ActionButtonProps> = ({
    icon: Icon,
    label,
    colorClass = 'text-primary',
    bgClass = 'bg-white',
    control,
    fieldName,
    onAccessChange,
    className,
}) => {
    const { getValues, setValue } = useFormContext();

    const { field } = useController({
        name: fieldName,
        control
    });

    const formValue = getValues(fieldName);
    const initialAccess = useMemo(() => {
        return formValue?.fullAccess
            ? 'fullAccess'
            : formValue?.noAccess
                ? 'noAccess'
                : 'specificAccess';
    }, [formValue]);

    const handleValueChange = (value: string) => {
        field.onChange(value);
        onAccessChange && onAccessChange(value);

    };

    const isDeleteFullAcces = fieldName !== 'deleteAccess' && getValues('deleteAccess.fullAccess')

    return (
        <div className={cn('flex flex-col space-y-2', className)}>
            <Button
                variant="outline"
                className={cn(
                    `flex items-center justify-center space-x-2 ${colorClass} ${bgClass}`,
                    'hover:bg-gray-100 transition-colors duration-200'
                )}
            >
                {Icon && <Icon className="w-5 h-5 mr-2" />}
                {label}
            </Button>
            <RadioGroup
                onValueChange={handleValueChange}
                value={initialAccess}
                className="p-5 space-y-2"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fullAccess" id={`${fieldName}-full`} />
                    <Label htmlFor={`${fieldName}-full`}>Full Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specificAccess" id={`${fieldName}-specific`} disabled={isDeleteFullAcces} />
                    <Label htmlFor={`${fieldName}-specific`}>Specific Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="noAccess" id={`${fieldName}-noAccess`} disabled={isDeleteFullAcces} />
                    <Label htmlFor={`${fieldName}-noAccess`}>No Access</Label>
                </div>
            </RadioGroup>
        </div>
    );
};

export default ActionButton