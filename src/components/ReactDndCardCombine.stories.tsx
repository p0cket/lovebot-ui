import type { Meta, StoryObj } from "@storybook/react"
import ReactDndCardCombine from "./ReactDndCardCombine"

const meta: Meta<typeof ReactDndCardCombine> = {
  title: "DragAndDrop/ReactDndCardCombine",
  component: ReactDndCardCombine,
  parameters: {
    layout: "centered",
  },
// //  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ReactDndCardCombine>

export const Default: Story = {
  args: {},
}