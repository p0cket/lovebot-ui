import type { Meta, StoryObj } from '@storybook/react'
import MiningSimulation from './Mine'

const meta: Meta<typeof MiningSimulation> = {
    title: 'Components/Mine',
    component: MiningSimulation,
    argTypes: {
        mineDuration: {
            control: { type: 'number' },
            defaultValue: 3000,
        },
        mineAmount: {
            control: { type: 'number' },
            defaultValue: 10,
        },
        workerSpeed: {
            control: { type: 'number' },
            defaultValue: 2000,
        },
        initialResources: {
            control: { type: 'number' },
            defaultValue: 0,
        },
        baseImage: {
            control: { type: 'text' },
            defaultValue: '/api/placeholder/64/64',
        },
        resourceImage: {
            control: { type: 'text' },
            defaultValue: '/api/placeholder/64/64',
        },
    },
}

export default meta
type Story = StoryObj<typeof MiningSimulation>

export const Default: Story = {}