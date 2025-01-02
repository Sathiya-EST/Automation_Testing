import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import ParentDataList from "./ParentList";

interface AsyncFieldAccordionProps {
    asyncFieldFormNames: string[];

}

const AsyncFieldAccordion = ({ asyncFieldFormNames }: AsyncFieldAccordionProps) => {
    if (!asyncFieldFormNames.length) {
        return null;
    }

    return (
        <Accordion type="single" collapsible className="w-full p-2">
            {asyncFieldFormNames.map((formName) => (
                <ParentDataList
                    formName={formName}
                    key={formName}
                />
            ))}
        </Accordion>
    );
};

export default AsyncFieldAccordion;