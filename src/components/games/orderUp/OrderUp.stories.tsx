import { Meta, StoryFn } from '@storybook/react';
import OrderUp from './OrderUp';

export default {
    title: 'Games/OrderUp',
    component: OrderUp,
    parameters: {
        layout: 'fullscreen',
    },
} as Meta<typeof OrderUp>;

const Template: StoryFn = () => <OrderUp />;

export const Default = Template.bind({});
Default.args = {};