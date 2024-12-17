import FormUpload from "@/assets/FormUpload";
import Text from "@/components/shared/Text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { UI_ROUTES } from "@/constants/routes";
import useBreadcrumb from "@/hooks/useBreadCrumb";
import { BreadcrumbItemType } from "@/types/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Globe, PlusSquare, SquarePen, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActionButton from "./components/ActionButton";
import { useGetPublishOptionsQuery, usePublishFormMutation } from "@/store/services/master/form";
import { useLocation } from "react-router-dom";
import AccessSection from "./components/AccessSection";


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

const PublishForm = () => {
    const location = useLocation();
    const { moduleName, formName } = location.state || {};
    const [isFormPublished, setIsFormPublished] = useState<boolean>(false);
    const Groups = ["Role", "Department", "User"];
    const { data: roleOptions } = useGetPublishOptionsQuery({
        formName: 'custom_role_details',
        accessKey: 'custom_role_name',
    });
    const { data: departmentOptions } = useGetPublishOptionsQuery({
        formName: 'custom_departments_details',
        accessKey: 'custom_department_name',
    });
    const { data: userOptions } = useGetPublishOptionsQuery({
        formName: 'custom_employee_details',
        accessKey: 'custom_employee_id',
    });
    const [publishForm, { isLoading, isSuccess, isError, error }] = usePublishFormMutation();
    const updatedRoutes: BreadcrumbItemType[] = useMemo(
        () => [
            { type: "link", title: moduleName, path: UI_ROUTES.MASTER, isActive: false },
            { type: "link", title: formName, path: UI_ROUTES.MASTER_FORM_CREATE, isActive: false },
            { type: "page", title: "Publish", isActive: true },
        ],
        []
    );
    useBreadcrumb(updatedRoutes);

    const form = useForm<z.infer<typeof publishSchema>>({
        resolver: zodResolver(publishSchema),
        defaultValues: {
            isPublished: true,
            deleteAccess: {
                fullAccess: false,
                noAccess: true
            },
            updateAccess: {
                fullAccess: false,
                noAccess: true
            },
            createAccess: {
                fullAccess: true
            },
            viewAccess: {
                fullAccess: true
            }
        },
    });

    const onSubmit = async (data: z.infer<typeof publishSchema>) => {
        const processedData = JSON.parse(JSON.stringify(data));

        const accessTypes = ['deleteAccess', 'updateAccess', 'createAccess', 'viewAccess'];

        accessTypes.forEach(type => {
            if (processedData[type]?.noAccess === true) {
                delete processedData[type];
            } else {
                delete processedData[type].noAccess
            }
        });
        try {
            const response = await publishForm({ formName: formName, publishData: processedData }).unwrap();
            console.log('Form published successfully:', response);
            alert('Form published successfully!');
        } catch (err) {
            console.error('Error publishing form:', err);
            alert('Failed to publish form.');
        }
        console.log("processedData", processedData);
        setIsFormPublished(false);
    };

    type AccessType = 'createAccess' | 'updateAccess' | 'viewAccess';
    type AccessGroup = 'DEPARTMENT' | 'ROLE' | 'USER';

    const handleDeleteAccessChange = (value: string) => {
        if (value === 'fullAccess') {
            form.reset({
                isPublished: true,
                deleteAccess: {
                    fullAccess: true
                },
                updateAccess: {
                    fullAccess: true
                },
                createAccess: {
                    fullAccess: true
                },
                viewAccess: {
                    fullAccess: true
                }
            })
        } else if (value === 'specificAccess') {
            form.setValue('deleteAccess.fullAccess', false);
            form.setValue('deleteAccess.noAccess', false);
            form.setValue('createAccess.noAccess', false);
            form.setValue('updateAccess.noAccess', false);
            form.setValue('viewAccess.noAccess', false);
        } else if (value === 'noAccess') {
            form.setValue('deleteAccess.noAccess', true);
        }
        // const deleteOptions = form.getValues('deleteAccess.specificAccess');
        // const accessTypes: AccessType[] = ['createAccess', 'updateAccess', 'viewAccess'];
        // const accessGroups: AccessGroup[] = ['DEPARTMENT', 'ROLE', 'USER'];

        // accessTypes.forEach(accessType => {
        //     const fullAccess = form.getValues(`${accessType}.fullAccess`);
        //     if (!fullAccess) {
        //         accessGroups.forEach(groupKey => {
        //             const deleteGroupValue = deleteOptions?.[groupKey];
        //             if (deleteGroupValue && deleteGroupValue.length > 0) {
        //                 form.setValue(`${accessType}.specificAccess.${groupKey}`, deleteGroupValue);
        //             }
        //         });
        //     }
        // });
    };

    const handleDeleteOptionChange = () => {
        const deleteOptions = form.getValues('deleteAccess.specificAccess');
        const accessTypes: AccessType[] = ['createAccess', 'updateAccess', 'viewAccess'];
        const accessGroups: AccessGroup[] = ['DEPARTMENT', 'ROLE', 'USER'];
        accessTypes.forEach(accessType => {
            const fullAccess = form.getValues(`${accessType}.fullAccess`);
            if (!fullAccess) {
                accessGroups.forEach(groupKey => {
                    const deleteGroupValue = deleteOptions?.[groupKey];
                    if (deleteGroupValue && deleteGroupValue.length > 0) {
                        form.setValue(
                            `${accessType}.specificAccess.${groupKey}`,
                            deleteGroupValue
                        );
                    }
                });
            }
        });

    };

    const handleEditAccessChange = (value: string) => {
        if (value === 'fullAccess') {
            form.setValue('updateAccess.fullAccess', true);
            form.setValue('updateAccess.noAccess', false);
            form.setValue('createAccess.fullAccess', true);
            form.setValue('viewAccess.fullAccess', true);
        } else if (value === 'specificAccess') {
            form.setValue('updateAccess.noAccess', false);
            form.setValue('updateAccess.fullAccess', false);
        } else if (value === 'noAccess') {
            form.setValue('updateAccess.noAccess', true);
        }
    }
    const handleEditOptionChange = () => {
        try {
            const editOptions = form.getValues('updateAccess.specificAccess');
            const isCreateFullAccess = form.getValues('createAccess.fullAccess');
            const isViewFullAccess = form.getValues('viewAccess.fullAccess');
            const ACCESS_TYPES: AccessType[] = ['createAccess', 'viewAccess'];
            const ACCESS_GROUPS: AccessGroup[] = ['DEPARTMENT', 'ROLE', 'USER'];

            if (!editOptions) {
                console.warn('No edit options found');
                return;
            }

            const propagationStrategy = (() => {
                if (!isCreateFullAccess && !isViewFullAccess) {
                    return !isCreateFullAccess
                        ? 'propagateToCreateAccess'
                        : 'propagateToViewAccess';
                }
                return 'propagateToAllAccess';
            })();
            const propagateAccessGroups = (targetAccessType: AccessType) => {
                ACCESS_GROUPS.forEach((groupKey) => {
                    const groupValue = editOptions[groupKey];

                    if (Array.isArray(groupValue) && groupValue.length > 0) {
                        form.setValue(
                            `${targetAccessType}.specificAccess.${groupKey}`,
                            groupValue
                        );
                    }
                });
            };

            // Execute propagation based on strategy
            switch (propagationStrategy) {
                case 'propagateToCreateAccess':
                    propagateAccessGroups('createAccess');
                    break;
                case 'propagateToViewAccess':
                    propagateAccessGroups('viewAccess');
                    break;
                case 'propagateToAllAccess':
                    ACCESS_TYPES.forEach(propagateAccessGroups);
                    break;
            }

        } catch (error) {
            console.error('Error in handleEditOptionChange:', error);
        }
    };

    const handleAddAccessChange = (value: string) => {
        if (value === 'fullAccess') {
            form.setValue('createAccess.fullAccess', true);
            form.setValue('createAccess.noAccess', false);
            form.setValue('viewAccess.fullAccess', true);
        } else if (value === 'specificAccess') {
            form.setValue('createAccess.noAccess', false);
            form.setValue('createAccess.fullAccess', false);
        } else if (value === 'noAccess') {
            form.setValue('createAccess.noAccess', true);
        }
    }
    const handleAddOptionChange = () => {
        const addOptions = form.getValues('createAccess.specificAccess');

        const accessTypes: AccessType[] = ['viewAccess'];
        const accessGroups: AccessGroup[] = ['DEPARTMENT', 'ROLE', 'USER'];

        accessTypes.forEach(accessType => {
            const fullAccess = form.getValues(`${accessType}.fullAccess`);
            if (!fullAccess) {
                accessGroups.forEach(groupKey => {
                    const deleteGroupValue = addOptions?.[groupKey];
                    if (deleteGroupValue && deleteGroupValue.length > 0) {
                        form.setValue(
                            `${accessType}.specificAccess.${groupKey}`,
                            deleteGroupValue
                        );
                    }
                });
            }
        });

    }

    const handleViewAccessChange = (value: string) => {
        if (value === 'fullAccess') {
            form.setValue('viewAccess.fullAccess', true);
            form.setValue('viewAccess.noAccess', false);
            // form.setValue('viewAccess.fullAccess', true);
        } else if (value === 'specificAccess') {
            form.setValue('viewAccess.noAccess', false);
            form.setValue('viewAccess.fullAccess', false);
        } else if (value === 'noAccess') {
            form.setValue('viewAccess.noAccess', true);
            form.setValue('viewAccess.fullAccess', false);

        }
    }
    const handleViewOptionChange = () => {
        const editOptions = form.getValues('updateAccess.specificAccess');
        console.log("editOptions", editOptions);

    }
    const groupOptions = {
        'Role': roleOptions,
        'Department': departmentOptions,
        'User': userOptions
    };

    const errors = form.formState.errors;
    console.log("errors", errors);
    return (
        <Dialog open={isFormPublished} onOpenChange={setIsFormPublished}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card className="p-1">
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
                        <CardContent className="max-h-[23rem] overflow-y-scroll">
                            <CardTitle className="text-md w-full">Module Name - Form Name</CardTitle>
                            <CardDescription className="text-xs">Form Description</CardDescription>

                            <div className="border mt-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
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
                                        <AccessSection
                                            accessType="deleteAccess"
                                            accessName="Delete"
                                            form={form}
                                            Groups={Groups}
                                            handleOptionChange={handleDeleteOptionChange}
                                            options={groupOptions}
                                            initialSelectedAccessKey=""
                                        />
                                    </div>

                                    {/* Edit Section */}
                                    <ActionButton
                                        icon={SquarePen}
                                        label="Edit"
                                        colorClass="text-green-600"
                                        control={form.control}
                                        bgClass={"bg-green-100"}
                                        fieldName={'updateAccess'}
                                        onAccessChange={handleEditAccessChange}
                                    />

                                    <div className="border col-span-4">
                                        <AccessSection
                                            accessType="updateAccess"
                                            accessName="Edit"
                                            form={form}
                                            Groups={Groups}
                                            handleOptionChange={handleEditOptionChange}
                                            options={groupOptions}
                                            initialSelectedAccessKey="deleteAccess.specificAccess"
                                        />
                                    </div>

                                    {/* Insert Section */}
                                    <ActionButton
                                        icon={PlusSquare}
                                        label="Insert"
                                        colorClass="text-blue-600"
                                        control={form.control}
                                        bgClass={"bg-blue-100"}
                                        fieldName="createAccess"
                                        onAccessChange={handleAddAccessChange}
                                    />

                                    <div className="border col-span-4">
                                        <AccessSection
                                            accessType="createAccess"
                                            accessName="Insert"
                                            form={form}
                                            Groups={Groups}
                                            handleOptionChange={handleAddOptionChange}
                                            options={groupOptions}
                                            initialSelectedAccessKey="updateAccess.specificAccess"
                                        />
                                    </div>

                                    {/* View Section */}
                                    <ActionButton
                                        icon={Eye}
                                        label="View"
                                        colorClass="text-primary"
                                        control={form.control}
                                        bgClass={"bg-primary/10"}
                                        fieldName="viewAccess"
                                        onAccessChange={handleViewAccessChange}
                                    />
                                    <div className="border col-span-4">
                                        <AccessSection
                                            accessType="viewAccess"
                                            accessName="View"
                                            form={form}
                                            Groups={Groups}
                                            handleOptionChange={handleViewOptionChange}
                                            options={groupOptions}
                                            initialSelectedAccessKey="createAccess.specificAccess"
                                        />
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