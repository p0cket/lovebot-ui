import type { Meta, StoryObj } from "@storybook/react"
import ReactDraggableFreeCombine from "./ReactDraggableFreeCombine"

const meta: Meta<typeof ReactDraggableFreeCombine> = {
  title: "DragAndDrop/ReactDraggableFreeCombine",
  component: ReactDraggableFreeCombine,
  parameters: {
    layout: "centered",
  },
// //  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ReactDraggableFreeCombine>

export const Default: Story = {}