import { Toggle } from "../ui/toggle";
import { Bell, ChevronDown, ChevronLeft, CircleUserRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { User } from "@/types/data";
import { UI_ROUTES } from "@/constants/routes";
import { Link, useNavigate } from "react-router-dom";

type HeaderProps = {
    userData: User;
    handleLogout: () => void
}

const Header = ({ userData, handleLogout }: HeaderProps) => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }
    return (
        <header className="flex justify-between items-center p-auto bg-card text-cardForeground">


            <div className=" bg-primary/5 p-2 rounded-md">
                <ChevronLeft className="w-5 h-5 text-primary  " strokeWidth={3} onClick={handleBack} />
            </div>
            <div className="flex items-center gap-6">
                {/* TODO:Header main content goes here */}

            </div>
            <div className="flex items-center gap-6">
                <Toggle><Bell /></Toggle>
                <Popover>
                    <PopoverTrigger className="flex items-center gap-3 cursor-pointer outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out">
                        {/* Avatar */}
                        <Avatar className="w-10 h-8 rounded-full overflow-hidden relative">
                            <AvatarImage className="w-full h-full object-cover" src="https://github.co/shadcn.png" alt="@shadcn" />
                            <AvatarFallback className="flex items-center justify-center w-full h-full text-gray-500 dark:text-gray-200">
                                <CircleUserRound className="text-xl" />
                            </AvatarFallback>
                        </Avatar>


                        {/* Username and Role */}
                        <div className="flex flex-col ml-3">
                            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{userData.userName}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{userData.userRole}</span>
                        </div>

                        {/* Down Arrow Icon */}
                        <ChevronDown className="text-gray-500 dark:text-gray-300 ml-2 mt-1" />
                    </PopoverTrigger>

                    <PopoverContent className="flex flex-col p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 w-48 rounded-lg shadow-lg">
                        <Link
                            to={UI_ROUTES.CHANGE_PASSWORD}
                            className="py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                        >
                            Change Password
                        </Link>

                        {/* <Link
                            to="/reset-password"
                            className="py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                        >
                            Reset Password
                        </Link> */}

                        <Link
                            to={UI_ROUTES.LOGIN}
                            onClick={handleLogout}
                            className="cursor-pointer py-2 px-4 text-sm font-medium text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-300"
                        >
                            Logout
                        </Link>
                    </PopoverContent>

                </Popover>
            </div>
        </header>
    );
};

export default Header;
