import type { Meta, StoryObj } from "@storybook/react"
import SlotMachine from "./SlotMachine"

const symbols = ["🍒", "🍋", "🍇", "🍉", "🍓", "🍍", "🍌", "🥝", "🍈", "🍑"]

const meta: Meta<typeof SlotMachine> = {
  title: "Games/SlotMachine",
  component: SlotMachine,
  parameters: {
    layout: "centered",
  },
//  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof SlotMachine>

export const Default: Story = {
  args: {
    symbols,
  },
}

export const Playing: Story = {
  args: {
    symbols,
  },
  play: async () => {
    // Demonstrate the spinning animation or additional logic here
  },
}
