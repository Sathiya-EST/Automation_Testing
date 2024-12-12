import FormUpload from "@/assets/FormUpload";
import { SearchableDropdown } from "@/components/shared/SearchableDropdown";
import Text from "@/components/shared/Text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UI_ROUTES } from "@/constants/routes";
import useBreadcrumb from "@/hooks/useBreadCrumb";
import { cn } from "@/lib/utils";
import { BreadcrumbItemType } from "@/types/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, Eye, Globe, PlusSquare, SquarePen, Trash, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useController, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";


const publishSchema = z.object({
    isPublished: z.boolean(),
    deleteAccess: z.object({
        fullAccess: z.boolean(),
        noAccess: z.boolean().optional(),
        specificAccess: z.object({
            DEPARTMENT: z.array(z.string()).optional(),
            ROLE: z.array(z.string()).optional(),
            USER: z.array(z.string()).optional(),
        }).optional(),
    }).refine(
        (data) => {
            if (data.specificAccess) {
                const hasSpecificAccess =
                    (data.specificAccess.DEPARTMENT?.length ?? 0) > 0 ||
                    (data.specificAccess.ROLE?.length ?? 0) > 0 ||
                    (data.specificAccess.USER?.length ?? 0) > 0;

                return hasSpecificAccess ? data.fullAccess === false : true;
            }
            return true;
        },
        {
            message: "When specific access is defined, fullAccess must be false"
        }
    ),
    updateAccess: z.object({
        fullAccess: z.boolean(),
        noAccess: z.boolean().optional(),
        specificAccess: z.object({
            DEPARTMENT: z.array(z.string()).optional(),
            ROLE: z.array(z.string()).optional(),
            USER: z.array(z.string()).optional(),
        }).optional(),
    }),
    createAccess: z.object({
        fullAccess: z.boolean(),
        noAccess: z.boolean().optional(),
        specificAccess: z.object({
            DEPARTMENT: z.array(z.string()).optional(),
            ROLE: z.array(z.string()).optional(),
            USER: z.array(z.string()).optional(),
        }).optional(),
    }).optional(),
    viewAccess: z.object({
        fullAccess: z.boolean(),
        noAccess: z.boolean().optional(),
        specificAccess: z.object({
            DEPARTMENT: z.array(z.string()).optional(),
            ROLE: z.array(z.string()).optional(),
            USER: z.array(z.string()).optional(),
        }).optional(),
    }),
});

// Dummy data for dropdown options
const dummyOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
];

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


const GroupSection = ({
    groupName,
    watch,
    setValue,
    accessType = 'createAccess',
    disabled = false,
    handleSelect
}: {
    groupName: string,
    control: any,
    watch: any,
    setValue: any,
    getValues: any,
    accessType?: string,
    disabled?: boolean,
    handleSelect?: (selectedValues: string[]) => void
}) => {
    const isFullAccess = watch(`${accessType}.fullAccess`);
    const deleteAccess = watch(`deleteAccess.fullAccess`);

    const [currentSelectedOptions, setCurrentSelectedOptions] = useState<string[]>([]);

    useEffect(() => {
        const updatedValues = watch(`${accessType}.specificAccess.${groupName.toUpperCase()}`) || [];
        setCurrentSelectedOptions(updatedValues);
    }, [watch(`${accessType}.specificAccess.${groupName.toUpperCase()}`)]);

    const handleValueChange = (selectedValues: string[]) => {
        if (isFullAccess || disabled) return;
        setValue(`${accessType}.specificAccess.${groupName.toUpperCase()}`, selectedValues, {
            shouldValidate: true
        });
        if (handleSelect) {
            handleSelect(selectedValues);
        }
    };

    const handleRemoveOption = (optionToRemove: string) => {
        if (deleteAccess) return;

        const newSelected = currentSelectedOptions.filter(
            option => option !== optionToRemove
        );
        setValue(`${accessType}.specificAccess.${groupName.toUpperCase()}`, newSelected, {
            shouldValidate: true
        });
        if (handleSelect) {
            handleSelect(newSelected);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-2 p-4">
            <FormItem className="flex items-center space-x-2 col-span-1 sm:col-span-2 lg:col-span-2">
                <FormLabel>{groupName}</FormLabel>
            </FormItem>

            {/* Dropdown for selecting group options */}
            <div className="flex items-center col-span-1 sm:col-span-3 lg:col-span-4">
                <SearchableDropdown
                    options={dummyOptions}
                    placeholder={`Select ${groupName}`}
                    multiselect={true}
                    disabled={disabled || deleteAccess}
                    selectedValues={currentSelectedOptions}
                    onValueChange={handleValueChange}
                />
            </div>

            {/* Display selected options */}
            <div className="col-span-1 sm:col-span-6 lg:col-span-6 border min-h-20 h-auto p-2 bg-primary/10 rounded-md flex flex-col flex-grow">
                {currentSelectedOptions.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                        <p className="font-semibold text-primary mb-2 text-sm w-full">
                            Selected {groupName}s:
                        </p>
                        {currentSelectedOptions.map((option, index) => (
                            <Badge
                                key={index}
                                className={`bg-primary/25 rounded-md p-2 flex space-x-2 items-center text-sm hover:bg-primary/30`}
                            >
                                <span className="text-primary">{option}</span>
                                <X
                                    className={`
                                    ${deleteAccess
                                            ? 'cursor-not-allowed text-muted-foreground '
                                            : 'cursor-pointer text-primary hover:text-primary'}
                                `}
                                    onClick={() => handleRemoveOption(option)}
                                    size={16}
                                />
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 font-normal text-sm">
                        No {groupName}s selected...
                    </p>
                )}
            </div>
        </div>
    );
};




const FullAccessInfoCard = () => {
    return (
        <Card className=" bg-green-50 shadow-xl border border-green-500 rounded-lg">
            <CardHeader className="flex items-center space-x-3 ">
                <div className="w-10 h-10 bg-green-200 text-green-600 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-green-600">Full Access to Deletion</h2>
            </CardHeader>

            <CardContent className="text-lg text-gray-700 ">
                You  have Provided <span className="font-semibold text-green-600">Full Access</span> to delete any records. Any authorized user can remove records.
            </CardContent>

            <CardContent className="text-sm text-gray-600 ">
                Full Access grants complete control over the deletion process. You can delete records regardless of their type, role, department, or user ID.
            </CardContent>

            <CardContent className=" ml-5 p-4 border-l-4 border-green-600 bg-green-100 text-sm text-green-700 mb-4">
                <strong>How Full Access Works:</strong>
                <ul className="list-inside list-disc space-y-2 mt-2">
                    <li><span className="font-semibold text-gray-800">No Restrictions:</span> Any authorized user can delete all records.</li>
                    <li><span className="font-semibold text-gray-800">Complete Control:</span> Full Access gives you the ability to manage and remove any content, ensuring total flexibility.</li>
                    <li><span className="font-semibold text-gray-800">Audit Trail:</span> Deletions will be logged for accountability, ensuring that all actions are recorded.</li>
                </ul>
            </CardContent>
        </Card>
    )
}
const NoAccessInfoCard = () => {
    return (
        <Card className="col-span-6 border p-4 bg-primary/10 rounded-md">
            <CardHeader>
                <div className="w-6 h-6 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <Text className="text-xl font-bold text-red-600">No Access to Deletion</Text>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-gray-700 mb-4">
                    Currently, no permission has been granted for deleting records to users.
                </p>
                <p className="text-sm text-gray-600 mb-6">
                    If you need to provide delete access, follow the instructions below to modify permissions based on specific criteria.
                </p>
                <CardContent className="p-4 border-l-4 border-red-600 bg-red-100 text-sm text-red-700 mb-4">
                    <strong>How to Provide Deletion Access:</strong>
                    <ul className="list-inside list-disc space-y-2 mt-2">
                        <li><span className="font-semibold text-gray-800">Click on "Specific Access":</span> This option allows you to control access based on <span className="font-semibold text-gray-800">Role</span>, <span className="font-semibold text-gray-800">Department</span>, or <span className="font-semibold text-gray-800">User ID</span>.</li>
                        <li><span className="font-semibold text-gray-800">Define Permissions:</span> Select specific roles, departments, or user IDs that should have deletion access.</li>
                    </ul>
                </CardContent>
            </CardContent>
        </Card>
    )
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
    const { getValues } = useFormContext();

    const { field } = useController({
        name: fieldName,
        control
    });

    const formValue = getValues(fieldName);
    const initialAccess = formValue?.fullAccess ? 'fullAccess' : formValue?.noAccess ? 'noAccess' : 'specifiAccess';

    const handleValueChange = (value: string) => {
        field.onChange(value);
        onAccessChange && onAccessChange(value);
    };


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
                value={field.value || initialAccess}
                className="p-5 space-y-2"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fullAccess" id={`${fieldName}-full`} />
                    <Label htmlFor={`${fieldName}-full`}>Full Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specificAccess" id={`${fieldName}-specific`} />
                    <Label htmlFor={`${fieldName}-specific`}>Specific Access</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="noAccess" id={`${fieldName}-noAccess`} />
                    <Label htmlFor={`${fieldName}-noAccess`}>No Access</Label>
                </div>
            </RadioGroup>
        </div>
    );
};


const PublishForm = () => {
    const [isFormPublished, setIsFormPublished] = useState<boolean>(false);
    const Groups = ["Role", "Department", "User"];

    const updatedRoutes: BreadcrumbItemType[] = useMemo(
        () => [
            { type: "link", title: "Master", path: UI_ROUTES.MASTER, isActive: false },
            { type: "link", title: "Form", path: UI_ROUTES.MASTER_FORM_CREATE, isActive: false },
            { type: "page", title: "Publish", isActive: true },
        ],
        []
    );
    useBreadcrumb(updatedRoutes);

    const form = useForm<z.infer<typeof publishSchema>>({
        resolver: zodResolver(publishSchema),
        defaultValues: {
            isPublished: true,

        },
    });

    const onSubmit = (data: z.infer<typeof publishSchema>) => {
        console.log(data);
        setIsFormPublished(false);
    };

    type AccessType = 'createAccess' | 'updateAccess' | 'viewAccess';
    type AccessGroup = 'DEPARTMENT' | 'ROLE' | 'USER';

    const handleDeleteAccessChange = (value: string) => {
        if (value === 'fullAccess') {
            form.setValue('deleteAccess.fullAccess', true);
            form.setValue('createAccess.fullAccess', true);
            form.setValue('updateAccess.fullAccess', true);
            form.setValue('viewAccess.fullAccess', true);
        } else if (value === 'specificAccess') {
            form.setValue('deleteAccess.fullAccess', false);
            form.setValue('createAccess.fullAccess', false);
            form.setValue('updateAccess.fullAccess', false);
            form.setValue('viewAccess.fullAccess', false);
        } else if (value === 'noAccess') {
            form.setValue('deleteAccess.noAccess', true);
        }
        const deleteOptions = form.getValues('deleteAccess.specificAccess');
        const accessTypes: AccessType[] = ['createAccess', 'updateAccess', 'viewAccess'];
        const accessGroups: AccessGroup[] = ['DEPARTMENT', 'ROLE', 'USER'];

        accessTypes.forEach(accessType => {
            accessGroups.forEach(groupKey => {
                const deleteGroupValue = deleteOptions?.[groupKey];
                if (deleteGroupValue && deleteGroupValue.length > 0) {
                    form.setValue(`${accessType}.specificAccess.${groupKey}`,deleteGroupValue);
                }
            });
        });
    };
    const handleDeleteOptionChange = (groupName: string, value: string[]) => {
        // Ensure groupName is transformed to uppercase
        const groupKey = groupName.toUpperCase();
        const deleteOptions = form.getValues('deleteAccess.specificAccess');

        const accessTypes: AccessType[] = ['createAccess', 'updateAccess', 'viewAccess'];
        const accessGroups: AccessGroup[] = ['DEPARTMENT', 'ROLE', 'USER'];

        accessTypes.forEach(accessType => {
            accessGroups.forEach(groupKey => {
                const deleteGroupValue = deleteOptions?.[groupKey];
                if (deleteGroupValue && deleteGroupValue.length > 0) {
                    // Propagate delete group selections to other access types
                    form.setValue(
                        `${accessType}.specificAccess.${groupKey}`,
                        deleteGroupValue
                    );
                }
            });
        });
        console.log("view access values", form.getValues('viewAccess.specificAccess'));

    };

    console.log("view access values 34", form.getValues('viewAccess.specificAccess'));
    const { control, watch, setValue, getValues } = form;
    const fullAccess = watch('deleteAccess.fullAccess');
    const noAccess = watch('deleteAccess.noAccess');
    const DeleteAccessSection = () => {
        const { control, watch, setValue, getValues } = form;
        const fullAccess = watch('deleteAccess.fullAccess');
        const noAccess = watch('deleteAccess.noAccess');

        return (
            <>

            </>
        );
    };
    return (
        <Dialog open={isFormPublished} onOpenChange={setIsFormPublished}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between border-b-2">
                                <Text className="font-semibold">Publish Settings</Text>
                                <DialogTrigger asChild>
                                    <Button type="submit" className="mb-2">
                                        <Globe />
                                        Publish
                                    </Button>
                                </DialogTrigger>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-md w-full">Module Name - Form Name</CardTitle>
                            <CardDescription className="text-xs">Form Description</CardDescription>

                            <div className="border mt-3">
                                <div className="grid grid-cols-5 gap-4 p-4">
                                    {/* Delete Section */}
                                    <ActionButton
                                        icon={Trash}
                                        label="Delete"
                                        colorClass="text-red-600"
                                        control={form.control}
                                        bgClass={"bg-red-100"}
                                        onAccessChange={handleDeleteAccessChange}
                                        fieldName={'deleteAccess'}
                                    />

                                    <div className="border col-span-4">
                                        {fullAccess ? (
                                            <FullAccessInfoCard />
                                        ) : !noAccess ? (
                                            Groups.map((group, index) => (
                                                <GroupSection
                                                    key={`delete-${group}-${index}`}
                                                    groupName={group}
                                                    control={control}
                                                    watch={watch}
                                                    setValue={setValue}
                                                    getValues={getValues}
                                                    accessType="deleteAccess"
                                                    disabled={fullAccess}
                                                    handleSelect={(value) => handleDeleteOptionChange(group, value)}

                                                />
                                            ))
                                        ) : <NoAccessInfoCard />}

                                    </div>

                                    {/* Edit Section */}
                                    <ActionButton
                                        icon={SquarePen}
                                        label="Edit"
                                        colorClass="text-green-600"
                                        control={form.control}
                                        bgClass={"bg-green-100"}
                                        fieldName={'updateAccess'}
                                    />

                                    <div className="border col-span-4">
                                        {fullAccess ? (
                                            <FullAccessInfoCard />
                                        ) : !noAccess ? (
                                            Groups.map((group, index) => (
                                                <GroupSection
                                                    key={`edit-${group}-${index}`}
                                                    groupName={group}
                                                    control={form.control}
                                                    watch={form.watch}
                                                    setValue={form.setValue}
                                                    getValues={form.getValues}
                                                    accessType="updateAccess"
                                                    disabled={!form.watch('updateAccess.fullAccess')}

                                                />
                                            ))
                                        ) : <NoAccessInfoCard />}

                                    </div>
                                    {/* Insert Section */}
                                    <ActionButton
                                        icon={PlusSquare}
                                        label="Insert"
                                        colorClass="text-blue-600"
                                        control={form.control}
                                        bgClass={"bg-blue-100"}
                                        fieldName="createAccess"
                                    />

                                    <div className="border col-span-4">
                                        {fullAccess ? (
                                            <FullAccessInfoCard />
                                        ) : !noAccess ? (
                                            Groups.map((group, index) => (
                                                <GroupSection
                                                    key={`insert-${group}-${index}`}
                                                    groupName={group}
                                                    control={form.control}
                                                    watch={form.watch}
                                                    setValue={form.setValue}
                                                    getValues={form.getValues}
                                                    accessType="createAccess"
                                                    disabled={!form.watch('createAccess.fullAccess')}

                                                />
                                            ))
                                        ) : <NoAccessInfoCard />}

                                    </div>
                                    {/* View Section */}
                                    <ActionButton
                                        icon={Eye}
                                        label="View"
                                        colorClass="text-primary"
                                        control={form.control}
                                        bgClass={"bg-primary/10"}
                                        fieldName="viewAccess"
                                    />
                                    <div className="border col-span-4">
                                        {fullAccess ? (
                                            <FullAccessInfoCard />
                                        ) : !noAccess ? (
                                            Groups.map((group, index) => (
                                                <GroupSection
                                                    key={`view-${group}-${index}`}
                                                    groupName={group}
                                                    control={form.control}
                                                    watch={form.watch}
                                                    setValue={form.setValue}
                                                    getValues={form.getValues}
                                                    accessType="viewAccess"
                                                    disabled={!form.watch('viewAccess.fullAccess')}

                                                />
                                            ))
                                        ) : <NoAccessInfoCard />}

                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>

            <DialogContent className="sm:max-w-100 h-auto">
                <FormUpload />
                <Text className='w-full text-center text-xl'>Form Generated Successfully!</Text>
            </DialogContent>
        </Dialog>
    );
};

export default PublishForm;