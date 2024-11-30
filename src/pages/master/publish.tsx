import FormUpload from "@/assets/FormUpload";
import { SearchableDropdown } from "@/components/shared/SearchableDropdown";
import Text from "@/components/shared/Text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UI_ROUTES } from "@/constants/routes";
import useBreadcrumb from "@/hooks/useBreadCrumb";
import { BreadcrumbItemType } from "@/types/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Globe, PlusSquare, SquarePen, Trash, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

// Zod schema for validation
const schema = z.object({
    isPublished: z.boolean(),
    createAccess: z.object({
        fullAccess: z.boolean(),
        specificAccess: z.object({
            DEPARTMENT: z.array(z.string()).optional(),
            ROLE: z.array(z.string()).optional(),
            USER: z.array(z.string()).optional(),
        }).optional(),
    }).optional(),
    updateAccess: z.object({
        fullAccess: z.boolean(),
        specificAccess: z.object({
            DEPARTMENT: z.array(z.string()).optional(),
            ROLE: z.array(z.string()).optional(),
            USER: z.array(z.string()).optional(),
        }).optional(),
    }).optional(),
    viewAccess: z.object({
        fullAccess: z.boolean(),
        specificAccess: z.object({
            DEPARTMENT: z.array(z.string()).optional(),
            ROLE: z.array(z.string()).optional(),
            USER: z.array(z.string()).optional(),
        }),
    }).optional(),
    deleteAccess: z.object({
        fullAccess: z.boolean(),
        specificAccess: z.object({
            DEPARTMENT: z.array(z.string()).optional(),
            ROLE: z.array(z.string()).optional(),
            USER: z.array(z.string()).optional(),
        }).optional(),
    }).optional(),
});

// Dummy data for dropdown options
const dummyOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
];


const GroupSection = ({
    groupName,
    control,
    watch,
    setValue,
    getValues,
    accessType = 'createAccess',
    disabled = false  // New prop to disable checkbox
}: {
    groupName: string,
    control: any,
    watch: any,
    setValue: any,
    getValues: any,
    accessType?: string,
    disabled?: boolean
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    // Watch the full access and specific access for the current access type
    const isFullAccess = watch(`${accessType}.fullAccess`);
    const currentSelectedOptions = watch(`${accessType}.specificAccess.${groupName.toUpperCase()}`) || [];

    useEffect(() => {
        // Sync local state with form state
        setSelectedOptions(currentSelectedOptions);
    }, [currentSelectedOptions]);

    const handleValueChange = (selectedValues: string[]) => {
        // Prevent selection if full access is true or checkbox is disabled
        if (isFullAccess || disabled) return;

        setSelectedOptions(selectedValues);
        setValue(`${accessType}.specificAccess.${groupName.toUpperCase()}`, selectedValues);
    };

    return (
        <div className="grid grid-cols-6 gap-4 p-4">
            <FormField
                control={control}
                name={`${accessType}.specificAccess.${groupName.toUpperCase()}`}
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                        <FormControl>
                            <Checkbox
                                disabled={disabled || isFullAccess}
                                checked={field.value && field.value.length > 0}
                                onCheckedChange={(checked) => {
                                    if (disabled) return;

                                    if (checked) {
                                        // Set fullAccess to true when checkbox is checked
                                        setValue(`${accessType}.fullAccess`, true);
                                    } else {
                                        // When unchecked, clear specific access
                                        setValue(`${accessType}.specificAccess.${groupName.toUpperCase()}`, []);

                                        const otherGroups = ['DEPARTMENT', 'ROLE', 'USER']
                                            .filter(group => group !== groupName.toUpperCase());

                                        const hasOtherSelections = otherGroups.some(group => {
                                            const groupValues = getValues(`${accessType}.specificAccess.${group}`);
                                            return groupValues && groupValues.length > 0;
                                        });

                                        if (!hasOtherSelections) {
                                            setValue(`${accessType}.fullAccess`, false);
                                        }
                                    }
                                }}
                                className="mt-2"
                            />
                        </FormControl>
                        <FormLabel>{groupName}</FormLabel>
                    </FormItem>
                )}
            />
            <div className="flex items-center col-span-2">
                <SearchableDropdown
                    options={dummyOptions}
                    placeholder={`Select ${groupName}`}
                    multiselect={true}
                    disabled={disabled || isFullAccess}
                    selectedValues={selectedOptions}
                    onValueChange={handleValueChange}
                />
            </div>
            {/* Rest of the component remains the same */}
        </div>
    );
};
/**
 * Component for rendering action buttons with switch controls.
 */
const ActionButton = ({
    icon: Icon,
    label,
    switchId,
    colorClass,
    control,
    bgClass,
    onSwitchChange
}: {
    icon: React.ElementType;
    label: string;
    switchId: string;
    colorClass: string;
    control: any;
    bgClass: string;
    onSwitchChange?: (checked: boolean) => void;
}) => (
    <div className="flex items-center space-x-4">
        <FormField
            control={control}
            name={`${label.toLowerCase()}Access.fullAccess`}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Switch
                            id={switchId}
                            aria-label={`Toggle ${label}`}
                            checked={field.value}
                            onCheckedChange={(checked) => {
                                field.onChange(checked);
                                onSwitchChange && onSwitchChange(checked);
                            }}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
        <div className="flex items-center">
            <Button variant="ghost" size="icon" className={`${bgClass} w-8 h-8 rounded m-2`}>
                <Icon className={colorClass} />
            </Button>
            <span>{label}</span>
        </div>
    </div>
);

const PublishForm = () => {
    const [isFormPublished, setIsFormPublished] = useState<boolean>(false);
    const Groups = ["Role", "Department", "User ID"];

    const updatedRoutes: BreadcrumbItemType[] = useMemo(
        () => [
            { type: "link", title: "Master", path: UI_ROUTES.MASTER, isActive: false },
            { type: "link", title: "Form", path: UI_ROUTES.MASTER_FORM_CREATE, isActive: false },
            { type: "page", title: "Publish", isActive: true },
        ],
        []
    );
    useBreadcrumb(updatedRoutes);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            isPublished: true,
            createAccess: { fullAccess: true, specificAccess: {} },
            updateAccess: { fullAccess: true, specificAccess: {} },
            viewAccess: { fullAccess: true, specificAccess: {} },
            deleteAccess: { fullAccess: true, specificAccess: {} },
        },
    });

    // const { control, setValue, getValues, watch } = form;

    const onSubmit = (data: z.infer<typeof schema>) => {
        console.log(data);
        setIsFormPublished(false);
    };

    type AccessType = 'createAccess' | 'updateAccess' | 'viewAccess';
    type AccessGroup = 'DEPARTMENT' | 'ROLE' | 'USER';

    const handleDeleteAccessChange = (checked: boolean) => {
        // When delete access is toggled, update other access settings
        const deleteOptions = form.getValues('deleteAccess.specificAccess');

        // Automatically enable View, Insert, Edit accesses when Delete is toggled
        form.setValue('viewAccess.fullAccess', checked);
        form.setValue('createAccess.fullAccess', checked);
        form.setValue('updateAccess.fullAccess', checked);

        // If delete access is given to specific groups, propagate to other access types
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
                                        switchId="delete-switch"
                                        colorClass="text-red-600"
                                        control={form.control}
                                        bgClass={"bg-red-100"}
                                        onSwitchChange={handleDeleteAccessChange}
                                    />

                                    <div className="border col-span-4">
                                        {Groups.map((group, index) => (
                                            <GroupSection
                                                key={`delete-${group}-${index}`}
                                                groupName={group}
                                                control={form.control}
                                                watch={form.watch}
                                                setValue={form.setValue}
                                                getValues={form.getValues}
                                                accessType="deleteAccess"
                                                disabled={!form.watch('deleteAccess.fullAccess')}
                                            />
                                        ))}
                                    </div>

                                    {/* Edit Section */}
                                    <ActionButton
                                        icon={SquarePen}
                                        label="Edit"
                                        switchId="edit-switch"
                                        colorClass="text-green-600"
                                        control={form.control}
                                        bgClass={"bg-green-100"}
                                    />

                                    <div className="border col-span-4">
                                        {Groups.map((group, index) => (
                                            <GroupSection
                                                key={`edit-${group}-${index}`}
                                                groupName={group}
                                                control={form.control}
                                                watch={form.watch}
                                                setValue={form.setValue}
                                                getValues={form.getValues}
                                                accessType="updateAccess"
                                            />
                                        ))}
                                    </div>

                                    {/* Insert Section */}
                                    <ActionButton
                                        icon={PlusSquare}
                                        label="Insert"
                                        switchId="insert-switch"
                                        colorClass="text-blue-600"
                                        control={form.control}
                                        bgClass={"bg-blue-100"}
                                    />

                                    <div className="border col-span-4">
                                        {Groups.map((group, index) => (
                                            <GroupSection
                                                key={`insert-${group}-${index}`}
                                                groupName={group}
                                                control={form.control}
                                                watch={form.watch}
                                                setValue={form.setValue}
                                                getValues={form.getValues}
                                                accessType="createAccess"
                                            />
                                        ))}
                                    </div>

                                    {/* View Section */}
                                    <ActionButton
                                        icon={Eye}
                                        label="View"
                                        switchId="view-switch"
                                        colorClass="text-primary"
                                        control={form.control}
                                        bgClass={"bg-primary/10"}
                                    />

                                    <div className="border col-span-4">
                                        {Groups.map((group, index) => (
                                            <GroupSection
                                                key={`view-${group}-${index}`}
                                                groupName={group}
                                                control={form.control}
                                                watch={form.watch}
                                                setValue={form.setValue}
                                                getValues={form.getValues}
                                                accessType="viewAccess"
                                            />
                                        ))}
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