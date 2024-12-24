import type { Meta, StoryFn } from "@storybook/react"
import DiceRoll from "./DiceRoll"

export default {
    title: "Components/DiceRoller",
    component: DiceRoll,
    argTypes: {
        size: {
            control: 'radio',
            options: ['small', 'medium', 'large'],
        },
    },
} as Meta<typeof DiceRoll>

const Template: StoryFn<typeof DiceRoll> = (args) => <DiceRoll {...args} />

export const Small = Template.bind({})
Small.args = {
    size: 'small',
}

export const Medium = Template.bind({})
Medium.args = {
    size: 'medium',
}

export const Large = Template.bind({})
Large.args = {
    size: 'large',
}

export const Playground = Template.bind({})
Playground.args = {
    size: 'medium',
}
