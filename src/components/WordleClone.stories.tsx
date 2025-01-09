import type { Meta, StoryObj } from "@storybook/react"
import WordleClone from "./WordleClone"

const meta = {
  title: "Games/WordleClone",
  component: WordleClone,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    wordList: {
      description: "Array of 5-letter words to use in the game",
      control: "object",
    },
    maxGuesses: {
      description: "Maximum number of guesses allowed",
      control: { type: "number", min: 1, max: 10 },
    },
    title: {
      description: "Game title displayed at the top",
      control: "text",
    },
    defaultMessage: {
      description: "Initial message to display",
      control: "text",
    },
  },
} satisfies Meta<typeof WordleClone>

export default meta
type Story = StoryObj<typeof meta>

// Default story with basic configuration
export const Default: Story = {
  args: {
    wordList: ["REACT", "CLONE", "WORLD", "PILOT", "STEAM", "BRAIN", "CLOUD"],
    maxGuesses: 6,
    title: "Wordle Clone",
    defaultMessage: "Try to guess the 5-letter word!",
  },
}

// Story with custom word list
export const CustomWordList: Story = {
  args: {
    wordList: ["HAPPY", "SMILE", "LAUGH", "PEACE", "DREAM"],
    maxGuesses: 6,
    title: "Happy Words Edition",
    defaultMessage: "Guess the happy word!",
  },
}

// Story with fewer guesses
export const HardMode: Story = {
  args: {
    wordList: ["TOUGH", "HARD", "TRICKY", "BRAIN"],
    maxGuesses: 3,
    title: "Hard Mode - 3 Guesses Only",
    defaultMessage: "Can you solve it in just 3 tries?",
  },
}

// Story with more guesses
export const PracticeMode: Story = {
  args: {
    wordList: ["LEARN", "STUDY", "TEACH", "SMART"],
    maxGuesses: 8,
    title: "Practice Mode - 8 Guesses",
    defaultMessage: "Take your time, you have 8 attempts!",
  },
}

// Story with technical terms
export const TechEdition: Story = {
  args: {
    wordList: ["REACT", "REDUX", "HOOKS", "PROPS", "STATE"],
    maxGuesses: 6,
    title: "Tech Stack Edition",
    defaultMessage: "Guess the programming term!",
  },
}

// Story with minimal configuration
export const Minimal: Story = {
  args: {
    wordList: ["BASIC"],
    maxGuesses: 6,
    title: "Simple Mode",
  },
}

// Story with custom styling through className props
export const CustomStyled: Story = {
  args: {
    ...Default.args,
    title: "Custom Styled Wordle",
    defaultMessage: "With custom styling options",
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
}
