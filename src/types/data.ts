export type User = {
    userName: string,
    userRole: string
}

export type BreadcrumbItemType =
    | {
        type: "link";
        title: string;
        path: string;
        isActive?: false;
    }
    | {
        type: "dropdown";
        title: string;
        dropdownItems: string[];
        isActive?: false;
    }
    | {
        type: "page";
        title: string;
        isActive: true;
    };