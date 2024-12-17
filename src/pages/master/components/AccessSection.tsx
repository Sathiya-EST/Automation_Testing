import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SelectOptions } from "@/types/data";
import { CheckIcon } from "lucide-react";
import GroupSection from "./PublishGroupSection";
import Text from "@/components/shared/Text";

const FullAccessInfoCard: React.FC<{ accessKey: string, accessName: string }> = ({ accessKey, accessName }) => {
    return (
        <Card className=" bg-green-50 shadow-xl border border-green-500 rounded-lg">
            <CardHeader className="flex items-center space-x-3 ">
                <div className="w-10 h-10 bg-green-200 text-green-600 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-green-600">Full Access to {accessName}</h2>
            </CardHeader>

            <CardContent className="text-lg text-gray-700 ">
                You  have Provided <span className="font-semibold text-green-600">Full Access</span> to {accessName} any records. Any authorized user can remove records.
            </CardContent>

            <CardContent className="text-sm text-gray-600 ">
                Full Access grants complete control over the deletion process. You can {accessName} records regardless of their type, role, department, or user ID.
            </CardContent>

            <CardContent className=" ml-5 p-4 border-l-4 border-green-600 bg-green-100 text-sm text-green-700 mb-4">
                <strong>How Full Access Works:</strong>
                <ul className="list-inside list-disc space-y-2 mt-2">
                    <li><span className="font-semibold text-gray-800">No Restrictions:</span> Any authorized user can {accessName} all records.</li>
                    <li><span className="font-semibold text-gray-800">Complete Control:</span> Full Access gives you the ability to manage and remove any content, ensuring total flexibility.</li>
                    <li><span className="font-semibold text-gray-800">Audit Trail:</span> Deletions will be logged for accountability, ensuring that all actions are recorded.</li>
                </ul>
            </CardContent>
        </Card>
    )
}
const NoAccessInfoCard: React.FC<{ accessKey: string, accessName: string }> = ({ accessKey, accessName }) => {
    return (
        <Card className="col-span-6 border p-4 bg-primary/10 rounded-md">
            <CardHeader>
                <div className="w-6 h-6 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <Text className="text-xl font-bold text-red-600">No Access to {accessName}</Text>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-gray-700 mb-4">
                    Currently, no permission has been granted for {accessName} records to users.
                </p>
                <p className="text-sm text-gray-600 mb-6">
                    If you need to provide {accessName} access, follow the instructions below to modify permissions based on specific criteria.
                </p>
                <CardContent className="p-4 border-l-4 border-red-600 bg-red-100 text-sm text-red-700 mb-4">
                    <strong>How to Provide Deletion Access:</strong>
                    <ul className="list-inside list-disc space-y-2 mt-2">
                        <li><span className="font-semibold text-gray-800">Select "Specific Access":</span> This option allows you to control access based on <span className="font-semibold text-gray-800">Role</span>, <span className="font-semibold text-gray-800">Department</span>, or <span className="font-semibold text-gray-800">User ID</span>.</li>
                        <li><span className="font-semibold text-gray-800">Define Permissions:</span> Select specific roles, departments, or user IDs that should have deletion access.</li>
                    </ul>
                </CardContent>
            </CardContent>
        </Card>
    )
}

// const AccessSection: React.FC<{
//     accessType: string;
//     accessName: string;
//     form: any;
//     Groups: string[];
//     handleOptionChange: (group: string, value: boolean) => void;
//     options: Record<string, SelectOptions[]>;
// }> = ({ accessType, accessName, form, Groups, handleOptionChange, options }) => {
//     const fullAccess = form.watch(`${accessType}.fullAccess`);
//     const noAccess = form.watch(`${accessType}.noAccess`);

//     const renderContent = () => {
//         if (fullAccess) {
//             return <FullAccessInfoCard accessKey={accessType} accessName={accessName} />;
//         }

//         if (!noAccess) {
//             return Groups.map((group, index) => (
//                 <GroupSection
//                     key={`${accessName}-${group}-${index}`}
//                     groupName={group}
//                     control={form.control}
//                     watch={form.watch}
//                     setValue={form.setValue}
//                     getValues={form.getValues}
//                     accessType={accessType}
//                     // disabled={!fullAccess}
//                     handleSelect={handleOptionChange}
//                     options={options[group] || []}
//                     initialSelectedValues={[]}
//                 />
//             ));
//         }

//         return <NoAccessInfoCard accessKey={accessType} accessName={accessName} />;
//     };

//     return <div className="border col-span-4">{renderContent()}</div>;
// };
const AccessSection: React.FC<{
    accessType: string;
    accessName: string;
    form: any;
    Groups: string[];
    handleOptionChange: (group: string, value: boolean) => void;
    options: Record<string, SelectOptions[]>;
    initialSelectedAccessKey: string; // Prop to identify which access group to watch for initial values
}> = ({ accessType, accessName, form, Groups, handleOptionChange, options, initialSelectedAccessKey }) => {
    const fullAccess = form.watch(`${accessType}.fullAccess`);
    const noAccess = form.watch(`${accessType}.noAccess`);
    // Dynamically watch for the specific access data based on accessType and initialSelectedAccessKey
    const specificAccessData = form.watch(initialSelectedAccessKey) || {}; // Fetch specific access data dynamically

    // Ensure specificAccessData is set correctly and watch for changes
    console.log(specificAccessData);

    const renderContent = () => {
        if (fullAccess) {
            return <FullAccessInfoCard accessKey={accessType} accessName={accessName} />;
        }

        if (!noAccess) {
            return Groups.map((group, index) => {
                const initialSelectedValues = specificAccessData[group.toUpperCase()] || [];
                console.log(`Initial selected values for group ${group}:`, initialSelectedValues);
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
