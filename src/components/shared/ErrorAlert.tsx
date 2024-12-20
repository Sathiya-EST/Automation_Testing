import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle } from "lucide-react";

interface AlertProps {
  variant: "destructive" | "default"
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const GenericAlert: React.FC<AlertProps> = ({ variant, title, description, icon }) => {
  return (
    <Alert variant={variant} className="flex items-center p-4 space-x-2">
      {icon && <div className="h-5 w-5">{icon}</div>}
      <div>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
    </Alert>
  );
};

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <GenericAlert
      variant="destructive"
      title="Error"
      description={message}
      icon={<AlertTriangle className="h-4 w-4" />}
    />
  );
};

export default ErrorAlert;
