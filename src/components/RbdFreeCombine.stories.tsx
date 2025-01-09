import type { Meta, StoryObj } from "@storybook/react"
import RbdFreeCombine from "./RbdFreeCombine"

const meta: Meta<typeof RbdFreeCombine> = {
  title: "DragAndDrop/RbdFreeCombine",
  component: RbdFreeCombine,
  parameters: {
    layout: "centered",
  },
// //  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof RbdFreeCombine>

export const Default: Story = {}