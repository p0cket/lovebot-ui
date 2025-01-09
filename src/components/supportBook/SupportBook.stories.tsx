import type { Meta, StoryObj } from '@storybook/react';
import SupportBook from './SupportBook';
import { 
    MessageCircle, 
    Headphones, 
    Video 
} from 'lucide-react';

const meta: Meta<typeof SupportBook> = {
    title: 'Components/SupportBook',
    component: SupportBook,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        topic: {
            control: 'text',
            description: 'The main topic of the support book',
        },
        peopleSentSupport: {
            control: { type: 'number', min: 0, max: 1000 },
            description: 'Number of people who have sent support',
        },
        messagesPerDay: {
            control: { type: 'number', min: 1, max: 10 },
            description: 'Number of messages that can be opened per day',
        },
        demoRefreshTime: {
            control: { type: 'number', min: 5, max: 300 },
            description: 'Time in seconds until messages refresh (demo purpose)',
        },
        messages: {
            control: 'object',
            description: 'Array of support messages',
        },
    },
};

export default meta;
type Story = StoryObj<typeof SupportBook>;

// Default story with basic props
export const Default: Story = {
    args: {
        topic: 'Getting Through a Breakup',
        peopleSentSupport: 12,
        messagesPerDay: 2,
        demoRefreshTime: 30,
    },
};

// Story with many messages
export const ManyMessages: Story = {
    args: {
        topic: 'Life Changes',
        peopleSentSupport: 50,
        messagesPerDay: 5,
        demoRefreshTime: 60,
        messages: [
            {
                id: 1,
                type: 'text',
                preview: 'Words of encouragement',
                content: 'You are stronger than you think. Keep going!',
                sender: 'Emily',
                icon: MessageCircle,
                animation: 'present'
            },
            {
                id: 2,
                type: 'audio',
                preview: 'Motivational song',
                content: '🎵 Custom motivational audio message',
                sender: 'David',
                icon: Headphones,
                animation: 'confetti'
            },
            {
                id: 3,
                type: 'video',
                preview: 'Support video',
                content: '📹 Personal video message',
                sender: 'Lisa',
                icon: Video,
                animation: 'sparkle'
            },
            // Additional messages
            {
                id: 4,
                type: 'text',
                preview: 'Daily inspiration',
                content: 'Every day is a new opportunity to start fresh.',
                sender: 'Mark',
                icon: MessageCircle,
                animation: 'present'
            },
            {
                id: 5,
                type: 'text',
                preview: 'Friendly reminder',
                content: 'Youve got this! One step at a time.',
                sender: 'Sophie',
                icon: MessageCircle,
                animation: 'sparkle'
            },
        ],
    },
};

// Story with limited messages
export const LimitedMessages: Story = {
    args: {
        topic: 'New Job Transition',
        peopleSentSupport: 5,
        messagesPerDay: 1,
        demoRefreshTime: 15,
        messages: [
            {
                id: 1,
                type: 'text',
                preview: 'Career advice',
                content: 'Trust the process. Your skills will shine through.',
                sender: 'John',
                icon: MessageCircle,
                animation: 'present'
            },
            {
                id: 2,
                type: 'text',
                preview: 'Tomorrows message',
                content: 'Locked until tomorrow',
                sender: 'Anna',
                icon: MessageCircle,
                animation: 'sparkle'
            },
        ],
    },
};

// Story with quick refresh time
export const QuickRefresh: Story = {
    args: {
        topic: 'Daily Motivation',
        peopleSentSupport: 25,
        messagesPerDay: 3,
        demoRefreshTime: 10,
    },
};

// Story with high engagement
export const HighEngagement: Story = {
    args: {
        topic: 'Community Support',
        peopleSentSupport: 999,
        messagesPerDay: 8,
        demoRefreshTime: 45,
    },
};

// Story with different animations
export const AnimationShowcase: Story = {
    args: {
        topic: 'Animation Demo',
        peopleSentSupport: 30,
        messagesPerDay: 6,
        demoRefreshTime: 30,
        messages: [
            {
                id: 1,
                type: 'text',
                preview: 'Present Animation',
                content: 'This message uses the present animation',
                sender: 'Alex',
                icon: MessageCircle,
                animation: 'present'
            },
            {
                id: 2,
                type: 'text',
                preview: 'Confetti Animation',
                content: 'This message uses the confetti animation',
                sender: 'Maria',
                icon: MessageCircle,
                animation: 'confetti'
            },
            {
                id: 3,
                type: 'text',
                preview: 'Sparkle Animation',
                content: 'This message uses the sparkle animation',
                sender: 'Chris',
                icon: MessageCircle,
                animation: 'sparkle'
            },
        ],
    },
};