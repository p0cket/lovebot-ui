import React, { useState, useRef } from "react"
import Draggable, { DraggableEvent, DraggableData } from "react-draggable"
import clsx from "clsx"

interface CardData {
  id: string
  content: string
  x: number
  y: number
}

const ReactDraggableFreeCombine: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([
    { id: "1", content: "Card A", x: 50, y: 50 },
    { id: "2", content: "Card B", x: 180, y: 100 },
    { id: "3", content: "Card C", x: 300, y: 200 },
  ])

  // We approximate card size to do overlap checks
  const CARD_WIDTH = 80
  const CARD_HEIGHT = 40

  const onStop = (id: string, e: DraggableEvent, data: DraggableData) => {
    const { x, y } = data
    // x,y is the final position relative to the parent node
    setCards((prev) => {
      // Update this card
      const updated = prev.map((c) => (c.id === id ? { ...c, x, y } : c))
      // Check overlap
      const current = updated.find((c) => c.id === id)!
      const overlapped = updated.find(
        (c) =>
          c.id !== current.id &&
          Math.abs(c.x - current.x) < CARD_WIDTH &&
          Math.abs(c.y - current.y) < CARD_HEIGHT
      )
      if (!overlapped) {
        return updated
      }
      // Combine
      const combined: CardData = {
        id: `${current.id}-${overlapped.id}`,
        content: `${current.content}+${overlapped.content}`,
        x: overlapped.x,
        y: overlapped.y,
      }
      return updated
        .filter((c) => c.id !== current.id && c.id !== overlapped.id)
        .concat(combined)
    })
  }

  return (
    <div className="relative w-[600px] h-[400px] border border-dashed border-gray-400">
      {cards.map((card) => (
        <Draggable
          key={card.id}
          defaultPosition={{ x: card.x, y: card.y }}
          onStop={(e, data) => onStop(card.id, e, data)}
        >
          <div
            className={clsx(
              "bg-white border border-gray-300 shadow-md rounded px-2 py-1 cursor-move",
              "absolute"
            )}
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
          >
            {card.content}
          </div>
        </Draggable>
      ))}
    </div>
  )
}

export default ReactDraggableFreeCombine