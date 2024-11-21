import { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  subcomponents: {
    AccordionItem: AccordionItem as any,
    AccordionTrigger: AccordionTrigger as any,
    AccordionContent: AccordionContent as any,
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
      defaultValue: "single",
    },
    defaultValue: {
      control: "text",
      description: "The default value of the accordion. Can be an array if type is 'multiple'.",
    },
  },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    type: "single",
    defaultValue: "item-1",

  },
  render: (args) => (
    <Accordion {...args} className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Item 1</AccordionTrigger>
        <AccordionContent>
          This is the content for Item 1. It's detailed and expands when the item is clicked.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Item 2</AccordionTrigger>
        <AccordionContent>
          This is the content for Item 2. Each item can contain any content you wish.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Item 3</AccordionTrigger>
        <AccordionContent>
          This is the content for Item 3. The accordion is flexible and styled.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: {
    type: "multiple",
    defaultValue: ["item-1"],
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Item 1</AccordionTrigger>
        <AccordionContent>
          This is the content for Item 1. It's detailed and expands when the item is clicked.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Item 2</AccordionTrigger>
        <AccordionContent>
          This is the content for Item 2. Each item can contain any content you wish.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Item 3</AccordionTrigger>
        <AccordionContent>
          This is the content for Item 3. The accordion is flexible and styled.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
