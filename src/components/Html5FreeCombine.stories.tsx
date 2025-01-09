import type { Meta, StoryObj } from "@storybook/react"
import Html5FreeCombine from "./Html5FreeCombine"

const meta: Meta<typeof Html5FreeCombine> = {
  title: "DragAndDrop/Html5FreeCombine",
  component: Html5FreeCombine,
  parameters: {
    layout: "centered",
  },
// //  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Html5FreeCombine>

export const Default: Story = {}