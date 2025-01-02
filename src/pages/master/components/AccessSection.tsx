import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SelectOptions } from "@/types/data";
import { CheckIcon, XIcon } from "lucide-react";
import GroupSection from "./PublishGroupSection";
import Text from "@/components/shared/Text";
import { useTranslation } from "react-i18next";

const FullAccessInfoCard: React.FC<{ accessKey: string, accessName: string }> = ({ accessKey, accessName }) => {
    const { t } = useTranslation()
    const accessMessage = t(`master.form.publish.fullAccessTo.${accessKey}`);
    return (
        <Card className=" bg-green-50 shadow-xl border border-green-500 rounded-lg">
            <CardHeader className="flex items-center space-x-3 ">
                <div className="w-10 h-10 bg-green-200 text-green-600 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-green-600">{t("master.form.publish.fullAccess")} {accessName}</h2>
            </CardHeader>

            <CardContent className="text-lg text-gray-700 ">
                {accessMessage}
                {/* You  have Provided <span className="font-semibold text-green-600">Full Access</span> to {accessName} any records. Any authorized user can remove records. */}
            </CardContent>

            {/* <CardContent className="text-sm text-gray-600 ">
                Full Access grants complete control over the deletion process. You can {accessName} records regardless of their type, role, department, or user ID.
            </CardContent> */}

            {/* <CardContent className=" ml-5 p-4 border-l-4 border-green-600 bg-green-100 text-sm text-green-700 mb-4">
                <strong>How Full Access Works:</strong>
                <ul className="list-inside list-disc space-y-2 mt-2">
                    <li><span className="font-semibold text-gray-800">No Restrictions:</span> Any authorized user can {accessName} all records.</li>
                    <li><span className="font-semibold text-gray-800">Complete Control:</span> Full Access gives you the ability to manage and remove any content, ensuring total flexibility.</li>
                    <li><span className="font-semibold text-gray-800">Audit Trail:</span> Deletions will be logged for accountability, ensuring that all actions are recorded.</li>
                </ul>
            </CardContent> */}
        </Card>
    )
}
const NoAccessInfoCard: React.FC<{ accessKey: string, accessName: string }> = ({ accessKey, accessName }) => {
    const { t } = useTranslation()
    const accessMessage = t(`master.form.publish.noAccessTo.${accessKey}`);
    return (
        <Card className=" bg-red-50 shadow-xl border border-red-500 rounded-lg">
            <CardHeader className="flex items-center space-x-3 ">
                <div className="w-10 h-10 bg-red-200 text-red-600 rounded-full flex items-center justify-center">
                    <XIcon className="w-6 h-6" />
                </div>
                <Text className="text-xl font-bold text-red-600"> {t("master.form.publish.noAccess")} {accessName}</Text>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-gray-700 mb-4">
                    {/* Currently, no permission has been granted for {accessName} records to users. */}
                    {/* {t("master.form.publish.fullAccessMsg",accessName)} */}
                    {accessMessage}
                </p>
                {/* <p className="text-sm text-gray-600 mb-6">
                    If you need to provide {accessName} access, follow the instructions below to modify permissions based on specific criteria.
                </p> */}
                {/* <CardContent className="p-4 border-l-4 border-red-600 bg-red-100 text-sm text-red-700 mb-4">
                    <strong>How to Provide Deletion Access:</strong>
                    <ul className="list-inside list-disc space-y-2 mt-2">
                        <li><span className="font-semibold text-gray-800">Select "Specific Access":</span> This option allows you to control access based on <span className="font-semibold text-gray-800">Role</span>, <span className="font-semibold text-gray-800">Department</span>, or <span className="font-semibold text-gray-800">User ID</span>.</li>
                        <li><span className="font-semibold text-gray-800">Define Permissions:</span> Select specific roles, departments, or user IDs that should have deletion access.</li>
                    </ul>
                </CardContent> */}
            </CardContent>
        </Card>
    )
}

const AccessSection: React.FC<{
    accessType: string;
    accessName: string;
    form: any;
    Groups: string[];
    handleOptionChange: () => void;
    options: Record<string, SelectOptions[]>;
    initialSelectedAccessKey: string;
}> = ({ accessType, accessName, form, Groups, handleOptionChange, options, initialSelectedAccessKey }) => {
    const fullAccess = form.watch(`${accessType}.fullAccess`);
    const noAccess = form.watch(`${accessType}.noAccess`);
    const specificAccessData = form.watch(initialSelectedAccessKey) || {};

    const renderContent = () => {
        if (fullAccess) {
            return <FullAccessInfoCard accessKey={accessType} accessName={accessName} />;
        }

        if (!noAccess) {
            return Groups.map((group, index) => {
                const initialSelectedValues = specificAccessData[group.toUpperCase()] || [];
                return (
                    <GroupSection
                        key={`${accessName}-${group}-${index}`}
                        groupName={group}
                        control={form.control}
                        watch={form.watch}
                        setValue={form.setValue}
                        getValues={form.getValues}
                        accessType={accessType}
                        handleSelect={handleOptionChange}
                        options={options[group] || []}
                        initialSelectedValues={initialSelectedValues}
                    />
                );
            });
        }

        return <NoAccessInfoCard accessKey={accessType} accessName={accessName} />;
    };

    return <div className="border col-span-4">{renderContent()}</div>;
};

export default AccessSection;
