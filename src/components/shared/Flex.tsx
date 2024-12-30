import React from "react";

type FlexProps = {
    dir?: "row" | "column" | "row-reverse" | "column-reverse";
    className?: string;
    children: React.ReactNode;
};

const Flex: React.FC<FlexProps> = ({ dir = "row", className = "", children }) => {
    const flexClasses = `flex ${dir === "row" ? "flex-row justify-between" : ""} 
                            ${dir === "column" ? "flex-col" : ""} 
                            ${dir === "row-reverse" ? "flex-row-reverse" : ""} 
                            ${dir === "column-reverse" ? "flex-col-reverse" : ""}`;

    return <div className={`${flexClasses} ${className}`}>{children}</div>;
};

export default Flex;
