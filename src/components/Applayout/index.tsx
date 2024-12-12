import { DatabaseZap, Settings, Workflow } from 'lucide-react';
import Header from './Header';
import { Menu } from './Menu';
import { Separator } from '../ui/separator';
import BreadcrumbComponent from './BreadcrumbComp';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import SessionExpiredModal from './SessionExpiredModal';
import { useSignOutMutation } from '@/store/services/auth/logout';
import { Outlet, useLocation } from 'react-router-dom';
import { UI_ROUTES } from '@/constants/routes';


const navigationItems = [
    {
        title: "Master",
        url: "/master",
        icon: DatabaseZap,
        items: [
            {
                title: "Master Form",
                url: UI_ROUTES.MASTER
            },
            {
                title: "Master Data",
                url: UI_ROUTES.MASTER_DATA
            }
        ],
        isActive: true
    },
    {
        title: "Process",
        url: "/process",
        icon: Workflow,
        items: [
            {
                title: "Creation",
                url: "#"
            },
            {
                title: "Perform",
                url: "#"
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




const AppLayout = () => {
    const isSessionExpired = useSelector((state: RootState) => state.auth.isExpired);
    const userName = useSelector((state: RootState) => state.auth.userName);
    const userRole = useSelector((state: RootState) => state.auth.userRole);
    const breadcrumbs = useSelector((state: RootState) => state.app.items);
    const [signOut] = useSignOutMutation();
    const location = useLocation();
    const userData = {
        userName,
        userRole,
    };
    const isMenuHidden = location.pathname === "/*" || location.pathname === "/404";
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
            {!isMenuHidden && (

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
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-14 bg-card text-card-foreground shadow-[0_2px_5px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_5px_rgba(255,255,255,0.1)] sticky top-0 z-10">
                    <div className="h-full px-4">
                        <Header userData={userData} handleLogout={handleLogout} />
                    </div>
                </header>
                <Separator orientation="horizontal" />
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-accent text-foreground ">
                    {breadcrumbs.length > 0 && <span className="inline-block w-auto my-1 ">
                        <BreadcrumbComponent items={breadcrumbs} />
                    </span>}

                    <SessionExpiredModal
                        isOpen={isSessionExpired}
                        onClose={function (): void {
                            throw new Error('Function not implemented.');
                        }}
                        handleNavigate={function (): void {
                            throw new Error('Function not implemented.');
                        }} />

                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;