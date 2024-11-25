import { AlertCircle, DatabaseZap, Settings, Workflow } from 'lucide-react';
import Header from './Header';
import { Menu } from './Menu';
import { Separator } from '../ui/separator';
import { BreadcrumbItemType, User } from '@/types/data';
import BreadcrumbComponent from './BreadcrumbComp';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@radix-ui/react-alert-dialog';
import { AlertDialogHeader, AlertDialogFooter } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import SessionExpiredModal from './SessionExpiredModal';
import { useSignOutMutation } from '@/store/services/auth/logout';


type Props = {
    children: React.ReactNode;
    breadcrumbItems: BreadcrumbItemType[];
    User: User

};

const navigationItems = [
    {
        title: "Master",
        url: "/master",
        icon: DatabaseZap,
        isActive: true
    },
    {
        title: "Process",
        url: "/process",
        icon: Workflow,
        items: [
            {
                title: "Getting Started",
                url: "/docs/getting-started"
            },
            {
                title: "API Reference",
                url: "/docs/api"
            }
        ]
    },
    {
        title: "Settings ",
        url: "/settings",
        icon: Settings,
        isActive: false
    },
];


// const breadcrumbItems: BreadcrumbItemType[] = [
//     { type: "link", title: "Home", path: "/", isActive: false },
//     {
//         type: "dropdown",
//         title: "More",
//         dropdownItems: ["Documentation", "Themes", "GitHub"],
//         isActive: false,
//     },
//     { type: "link", title: "Components", path: "/docs/components", isActive: false },
//     { type: "page", title: "Breadcrumb", isActive: true },
// ];


const AppLayout = ({ children, User, breadcrumbItems }: Props) => {
    const isSessionExpired = useSelector((state: RootState) => state.auth.isExpired);
    const [signOut] = useSignOutMutation();

    const handleLogout = async () => {
        try {
            await signOut({}).unwrap();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className=" bg-card text-card-foreground  h-screen">
                <div className="p-2">
                    <div>
                        <a href="#" className="block">
                            <div className="flex items-center justify-center  rounded-lg ">
                                <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
                            </div>
                        </a>
                    </div>
                </div>
                <Separator orientation="horizontal" />
                <nav className="pt-2 border-r sticky top-0 z-10">
                    <Menu items={navigationItems} />
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-14 bg-card text-card-foreground shadow-[0_2px_5px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_5px_rgba(255,255,255,0.1)] sticky top-0 z-10">
                    <div className="h-full px-4">
                        <Header userData={User} handleLogout={handleLogout} />
                    </div>
                </header>
                <Separator orientation="horizontal" />
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-accent text-foreground ">
                    <span className="inline-block w-auto my-1 ">
                        <BreadcrumbComponent items={breadcrumbItems} />
                    </span>

                    <SessionExpiredModal
                        isOpen={isSessionExpired}
                        onClose={function (): void {
                            throw new Error('Function not implemented.');
                        }}
                        handleNavigate={function (): void {
                            throw new Error('Function not implemented.');
                        }} />

                    {children}
                </div>
            </main>
        </div>
    );
};

export default AppLayout;