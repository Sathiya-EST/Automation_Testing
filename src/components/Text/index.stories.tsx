import { Meta, StoryObj } from '@storybook/react';
import Text from './';

const meta: Meta<typeof Text> = {
    title: 'Example/Text',
    component: Text,
    argTypes: {
        color: { control: 'color' },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
        },
    },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
    args: {
        children: 'This is a sample text',
        color: 'black',
        size: 'medium',
    },
};

export const LargeText: Story = {
    args: {
        children: 'This is a large text',
        color: 'blue',
        size: 'large',
    },
};

export const SmallText: Story = {
    args: {
        children: 'This is a small text',
        color: 'green',
        size: 'small',
    },
};
