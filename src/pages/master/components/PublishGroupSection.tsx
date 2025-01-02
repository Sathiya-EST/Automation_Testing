import { SearchableDropdown } from "@/components/shared/SearchableDropdown";
import { Badge } from "@/components/ui/badge";
import { FormItem, FormLabel } from "@/components/ui/form";
import { SelectOptions } from "@/types/data";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const GroupSection = ({
    groupName,
    watch,
    setValue,
    accessType = 'createAccess',
    handleSelect,
    options,
    initialSelectedValues = [],
}: {
    groupName: string,
    control: any,
    watch: any,
    setValue: any,
    getValues: any,
    accessType?: string,
    disabled?: boolean,
    handleSelect?: (selectedValues: string[]) => void,
    options: SelectOptions[],
    initialSelectedValues?: string[],
}) => {
    const isFullAccess = watch(`${accessType}.fullAccess`);
    const deleteAccess = watch(`deleteAccess.fullAccess`);
    const initialFormValues = watch(`${accessType}.specificAccess.${groupName.toUpperCase()}`) || [];
    const [currentSelectedOptions, setCurrentSelectedOptions] = useState<string[]>(
        Array.from(new Set([...initialFormValues, ...initialSelectedValues]))
    );
    const { t } = useTranslation()

    useEffect(() => {
        const updatedValues = watch(`${accessType}.specificAccess.${groupName.toUpperCase()}`) || [];
        setCurrentSelectedOptions(Array.from(new Set([...updatedValues, ...initialSelectedValues])));
    }, [watch(`${accessType}.specificAccess.${groupName.toUpperCase()}`), initialSelectedValues]);

    const handleValueChange = (selectedValues: string[]) => {
        setValue(`${accessType}.specificAccess.${groupName.toUpperCase()}`, selectedValues, {
            shouldValidate: true,
        });
        if (handleSelect) {
            handleSelect(selectedValues);
        }
    };

    const handleRemoveOption = (optionToRemove: string) => {
        if (deleteAccess || initialSelectedValues.includes(optionToRemove)) return;

        const newSelected = currentSelectedOptions.filter(option => option !== optionToRemove);
        setValue(`${accessType}.specificAccess.${groupName.toUpperCase()}`, newSelected, {
            shouldValidate: true,
        });
        if (handleSelect) {
            handleSelect(newSelected);
        }
    };
    const accessLabel = t(`master.form.publish.accessData.${groupName}.title`);
    const accessPlaceholder = t(`master.form.publish.accessData.${groupName}.placeholder`);
    const accessNodata = t(`master.form.publish.accessData.${groupName}.nodataPlaceholder`);
    const selected = t(`master.form.publish.accessData.${groupName}.selected`);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-2 p-4">
            <FormItem className="flex items-center space-x-2 col-span-1 sm:col-span-2 lg:col-span-2">
                <FormLabel>{accessLabel}</FormLabel>
            </FormItem>

            <div className="flex items-center col-span-1 sm:col-span-3 lg:col-span-4">
                <SearchableDropdown
                    options={options}
                    placeholder={accessPlaceholder}
                    multiselect={true}
                    disabled={deleteAccess}
                    selectedValues={currentSelectedOptions}
                    onValueChange={handleValueChange}
                />
            </div>

            <div className="col-span-1 sm:col-span-6 lg:col-span-6 border min-h-20 h-auto p-2 bg-primary/10 rounded-md flex flex-col flex-grow">
                {currentSelectedOptions.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                        <p className="font-semibold text-primary mb-2 text-sm w-full">
                            {selected}:
                        </p>
                        {currentSelectedOptions.map((option, index) => (
                            <Badge
                                key={index}
                                className={`bg-primary/25 rounded-md p-2 flex space-x-2 items-center text-sm hover:bg-primary/30`}
                            >
                                <span className="text-primary">{option}</span>
                                <X
                                    className={`${deleteAccess || initialSelectedValues.includes(option)
                                        ? 'cursor-not-allowed text-muted-foreground '
                                        : 'cursor-pointer text-primary hover:text-primary'
                                        }`}
                                    onClick={() => handleRemoveOption(option)}
                                    size={16}
                                />
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 font-normal text-sm">
                        {accessNodata}
                    </p>
                )}
            </div>
        </div>
    );
};

export default GroupSection;

