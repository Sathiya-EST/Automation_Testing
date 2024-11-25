import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ClockAlert } from 'lucide-react';

interface SessionExpiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    handleNavigate: () => void;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ isOpen, onClose, handleNavigate }) => {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex flex-col items-center justify-center max-w-lg p-8 text-center bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                {/* Icon Section */}
                <ClockAlert className="w-20 h-20 text-primary dark:text-primary-light" />

                {/* Header Section */}
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                        Your session has expired
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-300 text-center">
                        Please refresh the page. Don’t worry, we kept all your filters and breakdowns in place.
                    </DialogDescription>
                </DialogHeader>

                {/* Button Section */}
                <Button
                    onClick={handleNavigate}
                    className="mt-6 w-full max-w-xs bg-primary text-white py-3 rounded-md hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary-dark/90"
                >
                    LOGIN
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default SessionExpiredModal;
