import { Meta, StoryFn } from "@storybook/react"
import Clock, { ClockProps } from "./Clock"

// You can define union types in your component's props (e.g. in Clock.tsx):
// export interface ClockProps {
//   size?: number
//   borderColor?: "border-blue-500" | "border-red-500" | "border-green-500" | string
//   topHalfColor?: "bg-red-100" | "bg-green-400" | "bg-blue-100" | string
//   bottomHalfColor?: "bg-red-100" | "bg-green-400" | "bg-blue-100" | string
//   handColor?: "bg-black" | "bg-white" | string
//   speedFactor?: number
//   initialPaused?: boolean
// }

export default {
    title: "Components/Clock",
    component: Clock,
    argTypes: {
        size: {
            control: { type: "number" },
            description: "You can type any number, or pick from presets below.",
        },
        borderColor: {
            control: { type: "select" },
            options: ["border-blue-500", "border-red-500", "border-green-500"],
            description: "Choose from these or directly type a custom class in the code panel.",
        },
        topHalfColor: {
            control: { type: "select" },
            options: ["bg-red-100", "bg-green-400", "bg-blue-100"],
        },
        bottomHalfColor: {
            control: { type: "select" },
            options: ["bg-red-100", "bg-green-400", "bg-blue-100"],
        },
        handColor: {
            control: { type: "select" },
            options: ["bg-black", "bg-white"],
        },
        speedFactor: { control: { type: "number" } },
        initialPaused: { control: { type: "boolean" } },
    },
} as Meta

const Template: StoryFn<ClockProps> = (args) => <Clock {...args} />

export const Default = Template.bind({})
Default.args = {}

export const LargerClock = Template.bind({})
LargerClock.args = {
    size: 100,
    borderColor: "border-blue-500",
}

export const CustomColors = Template.bind({})
CustomColors.args = {
    topHalfColor: "bg-red-100",
    bottomHalfColor: "bg-green-400",
    handColor: "bg-black",
}

export const FasterClock = Template.bind({})
FasterClock.args = {
    speedFactor: 100000,
}

export const PausedByDefault = Template.bind({})
PausedByDefault.args = {
    initialPaused: true,
}