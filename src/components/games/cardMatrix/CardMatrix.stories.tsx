import { Meta, StoryObj } from "@storybook/react"
import CardMatrix, { RemovalTypes } from "./CardMatrix"

const meta: Meta = {
  title: "Roguelike/CardMatrix",
  component: CardMatrix,
  argTypes: {
    initialGridSize: {
      control: { type: "number", min: 2, max: 8 },
      defaultValue: 4,
      description: "Starting NxN grid size",
    },
    initialMixCount: {
      control: { type: "number", min: 1, max: 10 },
      defaultValue: 3,
      description: "Times to shuffle consecutively",
    },
    defaultRemovalType: {
      control: {
        type: "select",
        options: [
          RemovalTypes.REMOVE,
          RemovalTypes.DESTROY,
          RemovalTypes.REPLACE,
        ],
      },
      defaultValue: RemovalTypes.REMOVE,
      description: "Default removal behavior",
    },
  },
}

export default meta

type Story = StoryObj<typeof CardMatrix>

export const Default: Story = {
  render: (args) => <CardMatrix {...args} />,
}

export const BigGrid: Story = {
  render: (args) => <CardMatrix {...args} />,
  args: {
    initialGridSize: 6,
    initialMixCount: 5,
  },
}

export const ReplaceRemoval: Story = {
  render: (args) => <CardMatrix {...args} />,
  args: {
    defaultRemovalType: RemovalTypes.REPLACE,
  },
}

export const DestroyRemoval: Story = {
  render: (args) => <CardMatrix {...args} />,
  args: {
    defaultRemovalType: RemovalTypes.DESTROY,
  },
}
