import SelectDropdown from '@/components/shared/DropDown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Control, useController, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTypes, Field } from '@/types/data';
import { Button } from '@/components/ui/button';
import Text from '@/components/shared/Text';
import SelectFieldOptions from '@/pages/master/components/SelectFieldOptions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SelectWithCustomInput from '@/pages/master/components/SelectWithCustomInput';
import { useTranslation } from 'react-i18next';
import { useGetAsyncFormFieldsQuery, useGetModuleOptionsQuery } from '@/store/services/master/form';
import FieldInfoButton from '@/components/shared/FieldInfo';
import { X } from 'lucide-react';
import Flex from '@/components/shared/Flex';
import { Separator } from '@/components/ui/separator';



type FieldControllerProps = {
    control: Control<any>;
    fieldIndex: number;
    handleFieldUpdate: (value: string | boolean | number | string[], fieldName: string) => void;
    handleAsyncFieldUpdate: (value: string | boolean | number, fieldName: string) => void;
    dataType: DataTypes[];
    onDataTypeChange: any;
    isOpen: boolean;
    onClose: () => void
};

const FieldController = ({
    control,
    fieldIndex,
    handleFieldUpdate,
    handleAsyncFieldUpdate,
    dataType,
    onDataTypeChange,
    isOpen,
    onClose
}: FieldControllerProps) => {
    const [fieldsConfig, setFieldsConfig] = useState<Field>();
    const { t } = useTranslation();
    const [selectedAsynModule, setSelectedAsyncModule] = useState<string | null>(null)
    const [selectedAsynForm, setSelectedAsyncForm] = useState<string | null>(null)
    const { data: ModuleOptions } = useGetModuleOptionsQuery({
        pageNo: 1,
        pageSize: 10,
    });
    const { data: FormOptions } = useGetModuleOptionsQuery({
        pageNo: 1,
        pageSize: 10,
        selectedModuleName: selectedAsynModule ?? null
    });

    const { data: FieldOptions } = useGetAsyncFormFieldsQuery(selectedAsynForm ? selectedAsynForm : "");

    const { field: { value: selectedType } } = useController({
        name: `fields[${fieldIndex}].field.dataTypeName`,
        control,
    });
    const positiveOnly = useWatch({
        name: `fields[${fieldIndex}].field.positiveOnly`,
        control,
    });
    const negativeOnly = useWatch({
        name: `fields[${fieldIndex}].field.negativeOnly`,
        control,
    });
    const DataTypeoptions = dataType.map(item => ({
        // value: item.dataType,
        value: item.name,
        label: item.name
    }));
    const DefaultChoices = useWatch({
        name: `fields.${fieldIndex}.field.defaultChoice`,
        control,
    });

    useEffect(() => {
        if (selectedType) {
            const fieldConfig = dataType.find((field) => field.name === selectedType);
            console.log(fieldConfig);
            console.log(dataType);

            if (fieldConfig) {
                setFieldsConfig(fieldConfig as Field);
            } else {
                console.log("No fieldConfig found for dataType", selectedType);
            }
        }
    }, [selectedType, dataType]);

    const ASYNC_FIELD = 'Asynchronous List';
    const SELECT_FIELD = 'List Box';
    const FILE_FIELD = 'File Upload';
    const MAX_DEFAULTCHOICE = 3;

    const renderDefaultChoices = Array.isArray(DefaultChoices) && Array.isArray(DefaultChoices[fieldIndex])
        ? DefaultChoices[fieldIndex].length > 0
            ? DefaultChoices[fieldIndex].length > MAX_DEFAULTCHOICE
                ? DefaultChoices[fieldIndex].slice(0, MAX_DEFAULTCHOICE).join(", ") + "..."
                : DefaultChoices[fieldIndex].join(", ")
            : t('master.form.create.fieldController.selectField.noOptionLabel')
        : t('master.form.create.fieldController.selectField.hasOptionsLabel');


    const readOnlyValue = useWatch({
        control,
        name: `fields.${fieldIndex}.field.readOnly`,
        defaultValue: false,
    });
    const handleClose = () => {
        onClose();
    };
    return (
        <Card className={`p-0 fixed right-0 top-[64px] h-[calc(100vh-64px)] w-auto lg:w-[30%]  shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-auto`}>
            <CardHeader >
                <Flex dir='row'>
                    <CardTitle className='text-xl'>{t('master.form.create.fieldController.title')}</CardTitle>
                    <X
                        className="w-4 h-4 cursor-pointer"
                        onClick={handleClose}
                    />
                </Flex>
            </CardHeader>
            <Separator />
            <CardContent className="grid gap-2 overflow-y-auto  pb-5 mb-1">
                {/* Directly using parent form control */}
                <div className="grid gap-2 gap-y-5 " key={selectedType}>

                    {/* Column Name Field */}
                    <FormField
                        control={control}
                        name={`fields[${fieldIndex}].name`}
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center gap-2 relative">
                                <FormLabel htmlFor="name" className="text-left font-normal">
                                    {t('master.form.create.fieldController.NameField.label')}
                                </FormLabel>
                                <div className="col-span-2 relative group">
                                    <FormControl>
                                        <Input
                                            id="name"
                                            className="h-9"
                                            placeholder={t('master.form.create.fieldController.NameField.placeholder')}
                                            {...field}
                                            onChange={(e) => {
                                                handleFieldUpdate(e.target.value, 'name');
                                                field.onChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FieldInfoButton tooltipContent={t('master.form.create.fieldController.NameField.desc')} />
                                    <div className="min-h-[1rem]">
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Property Type Field */}
                    <FormField
                        control={control}
                        name={`fields[${fieldIndex}].field.dataTypeName`}
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center gap-2 relative">
                                <FormLabel htmlFor="dataTypeName" className="text-left font-normal">
                                    {t('master.form.create.fieldController.TypeField.label')}
                                </FormLabel>
                                <div className="col-span-2 group">
                                    <FormControl>
                                        <SelectDropdown
                                            options={DataTypeoptions}
                                            className="h-9 peer "
                                            onChange={(value) => {
                                                onDataTypeChange(fieldIndex)
                                                handleFieldUpdate(value, 'dataTypeName');
                                                field.onChange(value);
                                            }}
                                            value={field.value}
                                            placeholder={t('master.form.create.fieldController.TypeField.placeholder')}
                                        />
                                    </FormControl>
                                    <FieldInfoButton tooltipContent={t('master.form.create.fieldController.TypeField.desc')} />
                                    <div className="min-h-[1rem] ">
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {selectedType === SELECT_FIELD && (
                        <Popover>
                            <FormField
                                control={control}
                                name={`fields[${fieldIndex}].field.defaultChoice`}
                                render={() => (
                                    <FormItem className="grid grid-cols-3 items-center gap-2">
                                        <FormLabel htmlFor="type" className="text-left font-normal">
                                            {t('master.form.create.fieldController.selectField.label')}
                                        </FormLabel>
                                        <div className="col-span-2">
                                            <FormControl>
                                                {/* PopoverTrigger should properly wrap the Button */}
                                                <PopoverTrigger asChild>
                                                    <Button type="button" variant="outline" className='text-blue-500'>
                                                        {renderDefaultChoices}
                                                    </Button>
                                                </PopoverTrigger>
                                            </FormControl>

                                            <PopoverContent className="w-auto max-h-80 p-0 overflow-y-auto">
                                                <SelectFieldOptions control={control} fieldIndex={fieldIndex} />
                                            </PopoverContent>
                                            <FormMessage className="mt-1 text-sm text-red-600" />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </Popover>
                    )}
                    {selectedType === FILE_FIELD && (
                        <FormField
                            control={control}
                            name={`fields[${fieldIndex}].field.defaultChoice`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="type" className="text-left font-normal">
                                        {t('master.form.create.fieldController.fileTypeField.label')}
                                    </FormLabel>
                                    <div className="col-span-2 group">
                                        <FormControl>
                                            <SelectWithCustomInput
                                                onChange={(value: string[]) => {
                                                    handleFieldUpdate(value, 'defaultChoice');
                                                    field.onChange(value);
                                                }}
                                                placeholder={t('master.form.create.fieldController.fileTypeField.placeholder')}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FieldInfoButton tooltipContent={t('master.form.create.fieldController.fileTypeField.desc')} />
                                        <div className="min-h-[1rem] ">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Asynchoronous field Properties */}
                    {selectedType === ASYNC_FIELD && (
                        <>
                            <Text className="font-semibold">{t('master.form.create.fieldController.asyncField.title')}</Text>
                            {ModuleOptions && <FormField
                                control={control}
                                name={`fields[${fieldIndex}].field.asynchronousField.moduleName`}
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-2">
                                        <FormLabel htmlFor="moduleName" className="text-left font-normal">
                                            {t('master.form.create.fieldController.asyncField.moduleNameField.label')}
                                        </FormLabel>
                                        <div className="col-span-2 group relative">
                                            <FormControl>
                                                <SelectDropdown
                                                    options={ModuleOptions?.moduleOptions || []}
                                                    className="h-9 peer"
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        setSelectedAsyncModule(value)
                                                    }}
                                                    value={field.value || ""}
                                                    placeholder={t('master.form.create.fieldController.asyncField.moduleNameField.placeholder')}
                                                />
                                            </FormControl>
                                            <FieldInfoButton tooltipContent={t('master.form.create.fieldController.asyncField.moduleNameField.desc')} />
                                            <div className="min-h-[1rem] ">
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />}
                            {FormOptions && <FormField
                                control={control}
                                name={`fields[${fieldIndex}].field.asynchronousField.formName`}
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-2">
                                        <FormLabel htmlFor="formName" className="text-left font-normal">
                                            {t('master.form.create.fieldController.asyncField.formNameField.label')}
                                        </FormLabel>
                                        <div className="col-span-2 relative group">
                                            <FormControl>
                                                <SelectDropdown
                                                    options={FormOptions?.formOptions || []}
                                                    className="h-9 peer"
                                                    onChange={(value) => {
                                                        handleAsyncFieldUpdate(value, 'formName');
                                                        field.onChange(value);
                                                        setSelectedAsyncForm(value)
                                                    }}
                                                    value={field.value || ""}
                                                    placeholder={t('master.form.create.fieldController.asyncField.formNameField.placeholder')}
                                                />
                                            </FormControl>
                                            <FieldInfoButton tooltipContent={t('master.form.create.fieldController.asyncField.formNameField.desc')} />
                                            <div className="min-h-[1rem] ">
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />}
                            {FieldOptions && <FormField
                                control={control}
                                name={`fields[${fieldIndex}].field.asynchronousField.fieldName`}
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-2">
                                        <FormLabel htmlFor="fieldName" className="text-left font-normal">
                                            {t('master.form.create.fieldController.asyncField.fieldNameField.label')}
                                        </FormLabel>
                                        <div className="col-span-2 relative group">
                                            <FormControl>
                                                <SelectDropdown
                                                    options={FieldOptions?.options || []}
                                                    className="h-9 peer"
                                                    onChange={(value) => {
                                                        handleAsyncFieldUpdate(value, 'fieldName');
                                                        field.onChange(value);
                                                    }}
                                                    value={field.value || ""}
                                                    placeholder={t('master.form.create.fieldController.asyncField.fieldNameField.placeholder')}
                                                />
                                            </FormControl>
                                            <FieldInfoButton tooltipContent={t('master.form.create.fieldController.asyncField.fieldNameField.desc')} />
                                            <div className="min-h-[1rem] ">
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />}
                        </>

                    )}

                    {/* Dynamic Fields based on config */}
                    {fieldsConfig?.required && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.required`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="required" className="text-left font-normal">
                                        {t('master.form.create.fieldController.requiredField.label')}
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="required"
                                                className="text-gray-500"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'required');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            {t('master.form.create.fieldController.requiredField.desc')}
                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.uniqueValue && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.uniqueValue`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="uniqueValue" className="text-left font-normal">
                                        {t('master.form.create.fieldController.unique.label')}
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="uniqueValue"
                                                className="text-gray-500"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'uniqueValue');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            {t('master.form.create.fieldController.unique.desc')}
                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* {fieldsConfig?.readOnly && ( */}
                    <FormField
                        control={control}
                        name={`fields.${fieldIndex}.field.readOnly`}
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center gap-2">
                                <FormLabel htmlFor="readOnly" className="text-left font-normal">
                                    {t('master.form.create.fieldController.readOnlyField.label')}
                                </FormLabel>
                                <div className="col-span-2 flex items-center">
                                    <FormControl className="flex-shrink-0">
                                        <Checkbox
                                            id="readOnly"
                                            checked={readOnlyValue}
                                            onCheckedChange={(checked) => {
                                                handleFieldUpdate(checked, 'readOnly');
                                                field.onChange(checked);
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                        {t('master.form.create.fieldController.readOnlyField.desc')}
                                    </FormDescription>
                                </div>
                                <FormMessage className="col-span-3" />
                            </FormItem>
                        )}
                    />
                    {/* )} */}
                    {fieldsConfig?.alphabetic && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.alphabetic`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="alphabetic" className="text-left font-normal">
                                        {t('master.form.create.fieldController.alphabetic.label')}
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="alphabetic"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'alphabetic');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            {t('master.form.create.fieldController.alphabetic.desc')}
                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.alphanumeric && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.alphanumeric`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="alphanumeric" className="text-left font-normal">
                                        {t('master.form.create.fieldController.alphaneumeric.label')}
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="alphanumeric"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'alphanumeric');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            {t('master.form.create.fieldController.alphaneumeric.desc')}
                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.positiveOnly && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.positiveOnly`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="positiveOnly" className="text-left font-normal">
                                        {t('master.form.create.fieldController.positiveOnly.label')}
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="positiveOnly"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'positiveOnly');
                                                    field.onChange(checked);
                                                }}
                                                disabled={negativeOnly}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            {t('master.form.create.fieldController.positiveOnly.desc')}                                      </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.negativeOnly && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.negativeOnly`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="negativeOnly" className="text-left font-normal">
                                        {t('master.form.create.fieldController.negativeOnly.label')}
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="negativeOnly"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'negativeOnly');
                                                    field.onChange(checked);
                                                }}
                                                disabled={positiveOnly}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            {t('master.form.create.fieldController.negativeOnly.desc')}
                                        </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.multiple && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.multiple`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="multiple" className="text-left font-normal">
                                        {t('master.form.create.fieldController.multiple.label')}
                                    </FormLabel>
                                    <div className="col-span-2 flex items-center">
                                        <FormControl className="flex-shrink-0">
                                            <Checkbox
                                                id="multiple"
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    handleFieldUpdate(checked, 'multiple');
                                                    field.onChange(checked);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription className="ml-2 flex-grow text-sm text-gray-500">
                                            {t('master.form.create.fieldController.multiple.desc')}                                       </FormDescription>
                                    </div>
                                    <FormMessage className="col-span-3" />
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.placeholder && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.placeholder`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="placeholder" className="text-left font-normal">
                                        {t('master.form.create.fieldController.placeholder.label')}
                                    </FormLabel>
                                    <div className="col-span-2 relative group">
                                        <FormControl>
                                            <Input
                                                id="placeholder"
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'placeholder');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FieldInfoButton tooltipContent={t('master.form.create.fieldController.placeholder.desc')} />

                                        <div className="min-h-[1rem] ">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.defaultValue && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.defaultValue`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="defaultValue" className="text-left font-normal">
                                        {t('master.form.create.fieldController.defaultValue.label')}
                                    </FormLabel>
                                    <div className="col-span-2 relative group">
                                        <FormControl>
                                            <Input
                                                id="defaultValue"
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'defaultValue');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FieldInfoButton tooltipContent={t('master.form.create.fieldController.defaultValue.desc')} />
                                        <div className="min-h-[1rem] ">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.pattern && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.pattern`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="pattern" className="text-left font-normal">
                                        {t('master.form.create.fieldController.pattern.label')}
                                    </FormLabel>
                                    <div className="col-span-2 relative group">
                                        <FormControl>
                                            <Input
                                                id="pattern"
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'pattern');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FieldInfoButton tooltipContent={t('master.form.create.fieldController.pattern.desc')} />
                                        <div className="min-h-[1rem] ">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.formula && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.formula`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="formula" className="text-left font-normal">
                                        {t('master.form.create.fieldController.formula.label')}
                                    </FormLabel>
                                    <div className="col-span-2 relative group">
                                        <FormControl>
                                            <Input
                                                id="formula"
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'formula');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FieldInfoButton tooltipContent={t('master.form.create.fieldController.formula.desc')} />
                                        <div className="min-h-[1rem] ">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.defaultChoice && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.defaultChoice`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="defaultChoice" className="text-left font-normal">
                                        {t('master.form.create.fieldController.defaultChoice.label')}
                                    </FormLabel>
                                    <div className="col-span-2 relative group">
                                        <FormControl>
                                            <Input
                                                id="defaultChoice"
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    handleFieldUpdate(e.target.value, 'defaultChoice');
                                                    field.onChange(e);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FieldInfoButton tooltipContent={t('master.form.create.fieldController.defaultChoice.desc')} />
                                        <div className="min-h-[1rem] ">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.decimalLimit && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.decimalLimit`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="decimalLimit" className="text-left font-normal">
                                        {t('master.form.create.fieldController.decimalLimit.label')}
                                    </FormLabel>
                                    <div className="col-span-2 relative group">
                                        <FormControl>
                                            <Input
                                                id="decimalLimit"
                                                type='number'
                                                className="h-9 peer"
                                                onChange={(e) => {
                                                    const numericValue = Number(e.target.value);
                                                    handleFieldUpdate(numericValue, 'decimalLimit');
                                                    field.onChange(numericValue);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FieldInfoButton tooltipContent={t('master.form.create.fieldController.decimalLimit.desc')} />
                                        <div className="min-h-[1rem] ">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.min && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.min`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="min" className="text-left font-normal">
                                        {t('master.form.create.fieldController.min.label')}
                                    </FormLabel>
                                    <div className="col-span-2 relative group">
                                        <FormControl>
                                            <Input
                                                id="min"
                                                className="h-9 peer"
                                                type="number"
                                                onChange={(e) => {
                                                    const numericValue = parseFloat(e.target.value);
                                                    handleFieldUpdate(numericValue, 'min');
                                                    field.onChange(numericValue);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FieldInfoButton tooltipContent={t('master.form.create.fieldController.min.desc')} />
                                        <div className="min-h-[1rem] ">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}

                    {fieldsConfig?.max && (
                        <FormField
                            control={control}
                            name={`fields.${fieldIndex}.field.max`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel htmlFor="max" className="text-left font-normal">
                                        {t('master.form.create.fieldController.max.label')}
                                    </FormLabel>
                                    <div className="col-span-2 relative group">
                                        <FormControl>
                                            <Input
                                                id="max"
                                                className="h-9 peer"
                                                type="number"
                                                onChange={(e) => {
                                                    const numericValue = parseFloat(e.target.value);
                                                    handleFieldUpdate(numericValue, 'max');
                                                    field.onChange(numericValue);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FieldInfoButton tooltipContent={t('master.form.create.fieldController.max.desc')} />
                                        <div className="min-h-[1rem] ">
                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />
                    )}
                </div>
            </CardContent>
        </Card >
    );
};

export default FieldController;
