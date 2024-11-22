import React from "react";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BreadcrumbItemType } from "@/types/data";



interface BreadcrumbComponentProps {
    items: BreadcrumbItemType[];
}

const BreadcrumbComponent: React.FC<BreadcrumbComponentProps> = ({ items }) => {
    return (
        <Breadcrumb className="bg-gray-200 px-2 py-1 rounded-sm dark:bg-background">
            <BreadcrumbList >
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.type === "link" && (
                            <BreadcrumbItem className="text-xs font-semibold">
                                <BreadcrumbLink href={item.path} aria-current={item.isActive ? "page" : undefined}>
                                    {item.title}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        )}
                        {item.type === "dropdown" && (
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                                            <DropdownMenuItem key={dropdownIndex}>
                                                {dropdownItem}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </BreadcrumbItem>
                        )}
                        {item.type === "page" && (
                            <BreadcrumbItem className="text-xs " >
                                <BreadcrumbPage className="text-primary font-semibold">{item.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        )}
                        {index < items.length - 1 && <BreadcrumbSeparator className="text-gray-700 dark:text-gray-200" />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BreadcrumbComponent;