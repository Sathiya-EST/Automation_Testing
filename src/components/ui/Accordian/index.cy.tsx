/// <reference types="cypress" />
import { mount } from "cypress/react18";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

describe("Accordion Component", () => {
    it("renders the accordion with all items", () => {
        mount(
            <Accordion type="single" className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Item 1</AccordionTrigger>
                    <AccordionContent>Content for Item 1</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Item 2</AccordionTrigger>
                    <AccordionContent>Content for Item 2</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Item 3</AccordionTrigger>
                    <AccordionContent>Content for Item 3</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        // Check that all items are rendered
        cy.get("[role='button']").should("have.length", 3);
    });

    it("expands and collapses an item", () => {
        mount(
            <Accordion type="single" className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Item 1</AccordionTrigger>
                    <AccordionContent>Content for Item 1</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        // Initially, content is hidden
        cy.contains("Content for Item 1").should("not.be.visible");

        // Expand the item
        cy.contains("Item 1").click();
        cy.contains("Content for Item 1").should("be.visible");

        // Collapse the item
        cy.contains("Item 1").click();
        cy.contains("Content for Item 1").should("not.be.visible");
    });

    it("allows only one item to be expanded in single mode", () => {
        mount(
            <Accordion type="single" className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Item 1</AccordionTrigger>
                    <AccordionContent>Content for Item 1</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Item 2</AccordionTrigger>
                    <AccordionContent>Content for Item 2</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        // Expand the first item
        cy.contains("Item 1").click();
        cy.contains("Content for Item 1").should("be.visible");

        // Expand the second item
        cy.contains("Item 2").click();
        cy.contains("Content for Item 2").should("be.visible");

        // Ensure the first item is collapsed
        cy.contains("Content for Item 1").should("not.be.visible");
    });

    it("allows multiple items to be expanded in multiple mode", () => {
        mount(
            <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Item 1</AccordionTrigger>
                    <AccordionContent>Content for Item 1</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Item 2</AccordionTrigger>
                    <AccordionContent>Content for Item 2</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        // Expand the first item
        cy.contains("Item 1").click();
        cy.contains("Content for Item 1").should("be.visible");

        // Expand the second item
        cy.contains("Item 2").click();
        cy.contains("Content for Item 2").should("be.visible");

        // Ensure both items remain expanded
        cy.contains("Content for Item 1").should("be.visible");
    });
});
