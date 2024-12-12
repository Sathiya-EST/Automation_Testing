import React from 'react';
import { Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AccessDenied: React.FC = () => {
    return (
        <div className="flex items-center justify-center m-auto bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md text-center">
                {/* Header Section */}
                <CardHeader>
                    <div className="flex justify-center items-center">
                        <div className="bg-red-500 text-white rounded-full p-3 shadow-lg">
                            <Lock size={40} />
                        </div>
                    </div>
                    <CardTitle className="mt-4 text-xl font-bold">Access Denied</CardTitle>
                    <CardDescription>
                        You do not have the necessary permissions to view this page.
                    </CardDescription>
                </CardHeader>

                {/* Content Section */}
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Please contact the administrator if you believe this is a mistake.
                    </p>
                </CardContent>

                {/* Footer Section */}
                <CardFooter className="flex justify-center">
                    <Button onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AccessDenied;
