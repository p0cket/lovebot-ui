import type { Meta, StoryObj } from '@storybook/react';
import ObjectDisplayer from './ObjectDisplayer';

const meta: Meta<typeof ObjectDisplayer> = {
    title: 'Tools/ObjectDisplayer',
    component: ObjectDisplayer,
};
export default meta;

type Story = StoryObj<typeof ObjectDisplayer>;

export const Default: Story = {};