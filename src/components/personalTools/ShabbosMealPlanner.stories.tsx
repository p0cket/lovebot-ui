import { Meta, StoryFn } from '@storybook/react';
import ShabbosMealPlanner from './ShabbosMealPlanner';

export default {
    title: 'Components/ShabbosMealPlanner',
    component: ShabbosMealPlanner,
} as Meta;

export const Default: StoryFn = () => <ShabbosMealPlanner />;