import { BadgeInfo, FileBox } from 'lucide-react';

const FormSelectionPlaceholder = () => {
    return (
        <div className="flex items-center justify-center h-full my-10 py-4">
            <div className="text-center max-w-xl mx-auto">
                <div className="flex justify-center mb-8">
                    <FileBox className="text-primary" size={90} strokeWidth={1.75} />
                </div>
                <h2 className="text-3xl font-semibold  mb-4">
                    Choose Form
                </h2>
                <p className="text-lg  mb-8 leading-relaxed">
                    Select a Form from the sidebar to explore its available forms and access related functionalities.
                </p>

                <div className="bg-background shadow-lg rounded-xl p-6 border dark:shadow-gray-800">
                    <div className="flex items-center mb-4">
                        <span className="mr-3 text-primary">
                            <BadgeInfo />
                        </span>
                        <p className="font-medium">
                            Browse through the sidebar to discover Forms, each offering its own set of records.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormSelectionPlaceholder;
