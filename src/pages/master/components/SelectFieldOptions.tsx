import { useFieldArray, Controller } from "react-hook-form";
import { FormDescription, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const SelectFieldOptions = ({ control, fieldIndex }: { control: any; fieldIndex: number }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `fields.${fieldIndex}.field.defaultChoice`,
    });
    const { t } = useTranslation();
    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
            <FormLabel className="text-lg font-medium text-gray-700 mb-2">Options</FormLabel>
            <div className="space-y-4">
                {fields.length === 0 && (
                    <p className="text-sm text-gray-500">{t('master.form.create.fieldController.selectField.noOptionstitile')}</p>
                )}
                {fields.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-4">
                        {/* Input for Option */}
                        <Controller
                            control={control}
                            name={`fields.${fieldIndex}.field.defaultChoice.${index}`}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    className="flex-grow"
                                    placeholder={`Option ${index + 1}`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            )}
                        />
                        {/* Remove Option Button */}
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => remove(index)}
                            aria-label="Remove Option"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </Button>
                    </div>
                ))}
            </div>
            {/* Add Option Button */}
            <div className="mt-4">
                <Button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={() => append('')}
                >
                    <PlusIcon className="w-5 h-5" />
                    {t('master.form.create.fieldController.selectField.addOptionBtn')}
                </Button>
            </div>
            <FormDescription className="mt-2 text-sm text-gray-600">
            {t('master.form.create.fieldController.selectField.AddOptionDesc')}
            </FormDescription>
            <FormMessage />
        </div>
    );
};

export default SelectFieldOptions;
