import type { Meta, StoryObj } from '@storybook/react';
import DebugLogger from './FramerLogger';

const meta: Meta<typeof DebugLogger> = {
    title: 'Tools/DebugLogger',
    component: DebugLogger,
};

export default meta;
type Story = StoryObj<typeof DebugLogger>;

export const Default: Story = {
    render: () => <DebugLogger />,
};