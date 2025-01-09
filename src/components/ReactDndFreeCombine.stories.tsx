import type { Meta, StoryObj } from "@storybook/react"
import ReactDndFreeCombine from "./ReactDndFreeCombine"

const meta: Meta<typeof ReactDndFreeCombine> = {
  title: "DragAndDrop/ReactDndFreeCombine",
  component: ReactDndFreeCombine,
  parameters: {
    layout: "centered",
  },
// //  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ReactDndFreeCombine>

export const Default: Story = {}