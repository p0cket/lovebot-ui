import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shuffle,
  FlipVertical,
  FlipVertical2,
  Plus,
  Calculator,
  Grid,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react"

export enum RemovalTypes {
  REMOVE = "remove",
  DESTROY = "destroy",
  REPLACE = "replace",
}

export interface Card {
  id: number
  isFlipped: boolean
  value: number
  destroyed: boolean
}

function generateInitialCards(size: number): Card[] {
  const numCards = size * size
  return Array.from({ length: numCards }, (_, i) => ({
    id: i,
    isFlipped: false,
    value: i + 1,
    destroyed: false,
  }))
}

interface CardShufflerProps {
  initialGridSize?: number
  initialMixCount?: number
  defaultRemovalType?: RemovalTypes
}

const CardMatrix: React.FC<CardShufflerProps> = ({
  initialGridSize = 4,
  initialMixCount = 3,
  defaultRemovalType = RemovalTypes.REMOVE,
}) => {
  const [gridSize, setGridSize] = useState<number>(initialGridSize)
  const [points, setPoints] = useState<number>(0)
  const [cards, setCards] = useState<Card[]>(() =>
    generateInitialCards(initialGridSize)
  )
  const [isShuffling, setIsShuffling] = useState<boolean>(false)
  const [mixCount, setMixCount] = useState<number>(initialMixCount)
  const [removalType, setRemovalType] =
    useState<RemovalTypes>(defaultRemovalType)

  // Theme state (dark by default)
  const [isDark, setIsDark] = useState(true)
  const toggleTheme = () => setIsDark(!isDark)

  const startNewGame = () => {
    setPoints(0)
    setCards(generateInitialCards(gridSize))
  }

  const addLayer = () => {
    const newSize = gridSize + 1
    const currentValues = cards.map((card) => card.value)
    const maxCurrentValue = Math.max(...currentValues)
    const newCards: Card[] = Array.from(
      { length: newSize * newSize },
      (_, i) => {
        if (i < cards.length) return cards[i]
        return {
          id: i,
          isFlipped: false,
          value: maxCurrentValue + (i - cards.length + 1),
          destroyed: false,
        }
      }
    )
    setGridSize(newSize)
    setCards(newCards)
  }

  const getAdjacentIndices = (index: number): number[] => {
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    const adjacent: number[] = []
    if (row > 0) adjacent.push(index - gridSize)
    if (row < gridSize - 1) adjacent.push(index + gridSize)
    if (col > 0) adjacent.push(index - 1)
    if (col < gridSize - 1) adjacent.push(index + 1)
    return adjacent.filter(
      (idx) => idx >= 0 && idx < cards.length && !cards[idx].destroyed
    )
  }

  const evaluateDivisibleBy3 = () => {
    const visibleCards = cards.filter((c) => !c.isFlipped && !c.destroyed)
    const totalValue = visibleCards.reduce((sum, card) => sum + card.value, 0)
    if (totalValue % 3 === 0 && visibleCards.length > 0) {
      const updatedCards = [...cards]
      visibleCards.forEach((visibleCard) => {
        const index = updatedCards.findIndex((c) => c.id === visibleCard.id)
        switch (removalType) {
          case RemovalTypes.REMOVE:
            updatedCards[index] = { ...updatedCards[index], isFlipped: true }
            break
          case RemovalTypes.DESTROY:
            updatedCards[index] = { ...updatedCards[index], destroyed: true }
            break
          case RemovalTypes.REPLACE: {
            const adjacentIndices = getAdjacentIndices(index)
            if (adjacentIndices.length > 0) {
              const randomIdx =
                adjacentIndices[
                  Math.floor(Math.random() * adjacentIndices.length)
                ]
              updatedCards[index] = {
                ...updatedCards[index],
                isFlipped: updatedCards[randomIdx].isFlipped,
                value: updatedCards[randomIdx].value,
              }
            } else {
              updatedCards[index] = { ...updatedCards[index], destroyed: true }
            }
            break
          }
        }
      })
      setCards(updatedCards)
      setPoints((prev) => prev + totalValue)
    }
  }

  const fillGaps = () => {
    const visibleCards = cards.filter((c) => !c.isFlipped && !c.destroyed)
    if (!visibleCards.length) return
    const avgValue = Math.floor(
      visibleCards.reduce((sum, c) => sum + c.value, 0) / visibleCards.length
    )
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.isFlipped || card.destroyed) {
          const newVal = avgValue + Math.floor(Math.random() * 5) - 2
          return {
            ...card,
            isFlipped: false,
            destroyed: false,
            value: newVal,
          }
        }
        return card
      })
    )
  }

  const mixCards = async () => {
    setIsShuffling(true)
    const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
    for (let i = 0; i < mixCount; i++) {
      setCards((prevCards) => prevCards.map((c) => ({ ...c, isFlipped: true })))
      await delay(500)
      setCards((prevCards) => [...prevCards].sort(() => Math.random() - 0.5))
      await delay(500)
    }
    setIsShuffling(false)
  }

  const flipAll = (flipped: boolean) => {
    if (!isShuffling) {
      setCards((prev) => prev.map((c) => ({ ...c, isFlipped: flipped })))
    }
  }

  const flipCard = (index: number) => {
    if (isShuffling || cards[index].destroyed) return
    setCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, isFlipped: !card.isFlipped } : card
      )
    )
  }

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10) || 4
    if (newSize >= 2 && newSize <= 8) {
      setGridSize(newSize)
      setCards(generateInitialCards(newSize))
      setPoints(0)
    }
  }

  const handleMixCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10) || 3
    setMixCount(Math.max(1, Math.min(10, count)))
  }

  const faceUpValues = cards
    .filter((c) => !c.isFlipped && !c.destroyed)
    .map((c) => c.value)
    .sort((a, b) => a - b)

  return (
    <div
      className={`min-h-screen p-8 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={2}
            max={8}
            value={gridSize}
            onChange={handleGridSizeChange}
            className={`w-20 px-2 py-1 border rounded ${
              isDark ? "bg-gray-800 border-gray-600" : "bg-gray-100"
            }`}
          />
          <span className="text-lg font-medium">Grid Size</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium">Removal Type:</span>
          <select
            value={removalType}
            onChange={(e) => setRemovalType(e.target.value as RemovalTypes)}
            className={`px-2 py-1 border rounded ${
              isDark ? "bg-gray-800 border-gray-600" : "bg-gray-100"
            }`}
          >
            <option value={RemovalTypes.REMOVE}>Remove (Flip)</option>
            <option value={RemovalTypes.DESTROY}>Destroy (Leave Empty)</option>
            <option value={RemovalTypes.REPLACE}>Replace (Adjacent)</option>
          </select>
        </div>

        <div className="text-2xl font-bold">Points: {points}</div>
        <div className="text-lg font-medium">
          Revealed Cards: {faceUpValues.join(", ")}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={startNewGame}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isDark ? "bg-red-700 text-white" : "bg-red-500 text-white"
            }`}
          >
            <RefreshCw size={20} />
            New Game
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={mixCards}
              disabled={isShuffling}
              className={`flex items-center gap-2 px-4 py-2 rounded disabled:opacity-50 ${
                isDark ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
              }`}
            >
              <Shuffle size={20} />
              Mix Cards
            </button>
            <input
              type="number"
              min={1}
              max={10}
              value={mixCount}
              onChange={handleMixCountChange}
              className={`w-16 px-2 py-1 border rounded ${
                isDark ? "bg-gray-800 border-gray-600" : "bg-gray-100"
              }`}
            />
          </div>

          <button
            onClick={() => flipAll(true)}
            disabled={isShuffling}
            className={`flex items-center gap-2 px-4 py-2 rounded disabled:opacity-50 ${
              isDark ? "bg-green-700 text-white" : "bg-green-500 text-white"
            }`}
          >
            <FlipVertical size={20} />
            Flip All Down
          </button>
          <button
            onClick={() => flipAll(false)}
            disabled={isShuffling}
            className={`flex items-center gap-2 px-4 py-2 rounded disabled:opacity-50 ${
              isDark ? "bg-green-700 text-white" : "bg-green-500 text-white"
            }`}
          >
            <FlipVertical2 size={20} />
            Flip All Up
          </button>
          <button
            onClick={addLayer}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isDark ? "bg-purple-700 text-white" : "bg-purple-500 text-white"
            }`}
          >
            <Plus size={20} />
            Add Layer
          </button>
          <button
            onClick={evaluateDivisibleBy3}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isDark ? "bg-yellow-700 text-white" : "bg-yellow-500 text-white"
            }`}
          >
            <Calculator size={20} />
            Remove if Sum ÷ 3
          </button>
          <button
            onClick={fillGaps}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isDark ? "bg-indigo-700 text-white" : "bg-indigo-500 text-white"
            }`}
          >
            <Grid size={20} />
            Fill Gaps
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded bg-gray-600 text-white"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            Toggle Theme
          </button>
        </div>

        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          <AnimatePresence>
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                layout
                onClick={() => flipCard(index)}
                animate={{
                  rotateY: card.isFlipped ? 180 : 0,
                  opacity: card.destroyed ? 0.2 : 1,
                  x: isShuffling ? Math.random() * 50 - 25 : 0,
                  y: isShuffling ? Math.random() * 50 - 25 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="w-20 h-28 cursor-pointer"
                style={{ perspective: 1000 }}
              >
                <div
                  className={`w-full h-full relative transform-style-preserve-3d transition-transform duration-500
                                        ${
                                          card.isFlipped
                                            ? isDark
                                              ? "bg-blue-700"
                                              : "bg-blue-500"
                                            : isDark
                                              ? "bg-gray-800"
                                              : "bg-white"
                                        }
                                        rounded-lg shadow-lg flex items-center justify-center text-xl font-bold
                                        ${card.destroyed ? "bg-gray-200" : ""}`}
                >
                  {!card.isFlipped && !card.destroyed && card.value}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default CardMatrix
