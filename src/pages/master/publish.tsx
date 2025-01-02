import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, Globe, GlobeLock, PlusSquare, SquarePen, Trash } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { UI_ROUTES } from "@/constants/routes";

import useBreadcrumb from "@/hooks/useBreadCrumb";

import { useGetFormPreviewQuery, useGetPublishOptionsQuery, usePublishFormMutation } from "@/store/services/master/form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import Text from "@/components/shared/Text";

import ActionButton from "./components/ActionButton";
import AccessSection from "./components/AccessSection";

import FormUpload from "@/assets/FormUpload";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ROLES } from "@/constants/app.constants";
import { useTranslation } from "react-i18next";
import Flex from "@/components/shared/Flex";
import { useToast } from "@/hooks/use-toast";

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
    const { formName } = location.state || {};
    const [isFormPublished, setIsFormPublished] = useState<boolean>(false);
    const userRole = useSelector((state: RootState) => state.auth.userRole);
    const navigate = useNavigate();
    const Groups = ["Role", "Department", "User"];
    const { t } = useTranslation()
    const { toast } = useToast();

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
    const [publishForm] = usePublishFormMutation();
    const { data: formTemplateData } = useGetFormPreviewQuery(formName);

    useEffect(() => {
        if (userRole !== ROLES.DEVELOPER) {
            navigate(UI_ROUTES.ACCESS_DENIED, { replace: true });
        }
    }, [userRole, navigate]);

    useEffect(() => {
        if (!formName || !formTemplateData) {
            navigate(UI_ROUTES.MASTER, { replace: true });
        }
    }, [formName, formTemplateData, navigate]);

    // Breadcrumbs
    useBreadcrumb(
        useMemo(() => {
            if (!formTemplateData) {
                return [];
            }

            return [
                {
                    type: "link",
                    title: formTemplateData.moduleName || "Module",
                    path: UI_ROUTES.MASTER,
                    isActive: false,
                },
                {
                    type: "link",
                    title: formTemplateData.displayName || "Form",
                    path: UI_ROUTES.MASTER_FORM_CREATE,
                    isActive: false,
                },
                {
                    type: "page",
                    title: "Publish",
                    isActive: true,
                },
            ];
        }, [formTemplateData])
    );

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
        try {
            const processedData = JSON.parse(JSON.stringify(data));
            const accessTypes = ['deleteAccess', 'updateAccess', 'createAccess', 'viewAccess'];
            accessTypes.forEach((type) => {
                if (processedData[type]?.noAccess === true) {
                    delete processedData[type];
                } else if (processedData[type]?.noAccess !== undefined) {
                    delete processedData[type].noAccess;
                }
            });
            await publishForm({ formName, publishData: processedData }).unwrap();
            setIsFormPublished(true)
            setTimeout(() => {
                setIsFormPublished(false)
                navigate(UI_ROUTES.MASTER, { replace: true });
            }, 3000);
        } catch (err) {
            console.error("Error publishing form:", err);
            toast({
                title: "Error Publish Form",
                description: "Failed to Publish Form. Please try again.",
                variant: "destructive",
            });
        }
    };
    const handleUnpublish = async () => {
        try {
            await publishForm({ formName, publishData: { isPublished: false } }).unwrap();
            navigate(UI_ROUTES.MASTER, { replace: true });
        } catch (error) {
            console.error('Error unpublishing the form:', error);
            alert('Failed to unpublish the form. Please try again later.');
        }
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
            form.setValue('deleteAccess.fullAccess', false);
            form.setValue('updateAccess.fullAccess', false);
            form.setValue('createAccess.fullAccess', false);

        }
    }
    const handleViewOptionChange = () => {
        // const editOptions = form.getValues('updateAccess.specificAccess');
        console.log("view option change");
        
    }
    const groupOptions = {
        'Role': roleOptions,
        'Department': departmentOptions,
        'User': userOptions
    };

    const errors = form.formState.errors;
    console.log("errors", errors);

    return (
        <>
            {userRole == ROLES.DEVELOPER && (
                <Dialog open={isFormPublished} onOpenChange={setIsFormPublished}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <Card className="p-1">
                                <CardHeader className="py-2">
                                    <div className="flex items-center justify-between border-b-1">
                                        <Text className="font-semibold"> {t("master.form.publish.title")}</Text>
                                        <DialogTrigger asChild>
                                            <Flex className="space-x-2">
                                                <Button type="submit" className="mb-2">
                                                    <Globe />
                                                    {t("master.form.publish.publishBtn")}
                                                </Button>
                                                {formTemplateData?.isPublished &&
                                                    <Button type="button" onClick={() => handleUnpublish()} className="mb-2 bg-destructive hover:bg-destructive">
                                                        <GlobeLock />
                                                        {t("master.form.publish.unpublishedBtn")}
                                                    </Button>
                                                }
                                            </Flex>
                                        </DialogTrigger>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-md w-full">{formTemplateData?.moduleName} - {formTemplateData?.displayName}</CardTitle>
                                    <CardDescription className="text-xs">{formTemplateData?.formDescription}</CardDescription>

                                    <div className="border mt-1">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                                            {/* Delete Section */}
                                            <ActionButton
                                                icon={Trash}
                                                label={t("master.form.publish.deleteLabel")}
                                                colorClass="text-red-600"
                                                control={form.control}
                                                bgClass={"bg-red-100"}
                                                onAccessChange={handleDeleteAccessChange}
                                                fieldName={'deleteAccess'}
                                            />

                                            <div className="border col-span-4">
                                                <AccessSection
                                                    accessType="deleteAccess"
                                                    accessName={t("master.form.publish.deleteLabel")}
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
                                                label={t("master.form.publish.updateLabel")}
                                                colorClass="text-green-600"
                                                control={form.control}
                                                bgClass={"bg-green-100"}
                                                fieldName={'updateAccess'}
                                                onAccessChange={handleEditAccessChange}
                                            />

                                            <div className="border col-span-4">
                                                <AccessSection
                                                    accessType="updateAccess"
                                                    accessName={t("master.form.publish.updateLabel")}
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
                                                label={t("master.form.publish.insertLabel")}
                                                colorClass="text-blue-600"
                                                control={form.control}
                                                bgClass={"bg-blue-100"}
                                                fieldName="createAccess"
                                                onAccessChange={handleAddAccessChange}
                                            />

                                            <div className="border col-span-4">
                                                <AccessSection
                                                    accessType="createAccess"
                                                    accessName={t("master.form.publish.insertLabel")}
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
                                                label={t("master.form.publish.viewLabel")}
                                                colorClass="text-primary"
                                                control={form.control}
                                                bgClass={"bg-primary/10"}
                                                fieldName="viewAccess"
                                                onAccessChange={handleViewAccessChange}
                                            />
                                            <div className="border col-span-4">
                                                <AccessSection
                                                    accessType="viewAccess"
                                                    accessName={t("master.form.publish.viewLabel")}
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

                    {isFormPublished && (
                        <DialogContent className="sm:max-w-100 h-auto">
                            <FormUpload />
                            <Text className='w-full text-center text-xl'>{t("master.form.publish.publishSuccess")}</Text>
                        </DialogContent>
                    )}
                </Dialog>
            )}
        </>
    );
};

export default PublishForm;