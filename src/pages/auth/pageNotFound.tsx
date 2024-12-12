import React from "react";
import { Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PageNotFound: React.FC = () => {
    return (
        <div className="flex items-center justify-center m-auto bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md text-center">
                {/* Header Section */}
                <CardHeader>
                    <div className="flex justify-center items-center">
                        <div className="bg-blue-500 text-white rounded-full p-3 shadow-lg">
                            <Search size={40} />
                        </div>
                    </div>
                    <CardTitle className="mt-4 text-xl font-bold">Page Not Found</CardTitle>
                    <CardDescription>
                        Oops! The page you’re looking for doesn’t exist.
                    </CardDescription>
                </CardHeader>

                {/* Content Section */}
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        It seems you’ve reached a broken link or mistyped the URL. Please check and try again.
                    </p>
                </CardContent>

                {/* Footer Section */}
                <CardFooter className="flex flex-col gap-3">
                    <Button onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                    <Button variant="ghost" onClick={() => (window.location.href = "/")}>
                        Go to Homepage
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PageNotFound;
