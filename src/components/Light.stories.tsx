import type { Meta, StoryObj } from "@storybook/react"
import Light from "./Light"

const meta: Meta<typeof Light> = {
  title: "Light",
  component: Light,
  //autodocs
  // tags: ['autodocs'],
  argTypes: {
    variant: {
      //   control: {
      //     type: "select",
      //     options: ["red", "green", "yellow"],
      //   },
      options: ["red", "green", "yellow"],
      control: { type: "radio" },
    },
  },
}

export default meta

type Story = StoryObj<typeof Light>

export const Base: Story = {
  args: {
    variant: "green",
  },
}

export const Red: Story = {
  args: {
    variant: "red",
  },
}

export const Yellow: Story = {
  args: {
    variant: "yellow",
  },
}

export const AnotherStory: Story = {
  args: {
    variant: "red",
  },
  render: (args) => <Light {...args} />,
}

export const GroupOfThem: Story = {
  args: {
    variant: "red",
  },
  render: (args) => (
    <div>
      <Light {...args} />
      <Light {...args} />
      <Light {...args} />
    </div>
  ),
}
