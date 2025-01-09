import type { Meta, StoryObj } from "@storybook/react"
import Html5CardCombine from "./Html5CardCombine"

/**
 * Main metadata for the Html5CardCombine story.
 */
const meta: Meta<typeof Html5CardCombine> = {
    title: "DragAndDrop/Html5CardCombine",
    component: Html5CardCombine,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component: "Demonstrates basic HTML5 drag-and-drop card combination.",
            },
        },
    },
    /**
     * Defining controls to adjust props at runtime.
     */
    argTypes: {
        backgroundColor: {
            control: { type: "color" },
            description: "Sets the container background color.",
        },
        initialCards: {
            control: { type: "object" },
            description: "Initial array of cards to display.",
        },
    },
}

export default meta
type Story = StoryObj<typeof Html5CardCombine>

/**
 * The default story with adjustable props.
 */
export const Default: Story = {
    args: {
        // Provide default values for the new props
        backgroundColor: "#ffffff",
        initialCards: [
            { id: "1", content: "Item 1" },
            { id: "2", content: "Item 2" },
            { id: "3", content: "Item 3" },
        ],
    },
}