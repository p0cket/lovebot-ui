import React, { useState, DragEvent, MouseEvent, CSSProperties } from "react"
import clsx from "clsx"

interface CardData {
  id: string
  content: string
  x: number
  y: number
}

const CARD_WIDTH = 80
const CARD_HEIGHT = 40

const Html5FreeCombine: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([
    { id: "1", content: "Card A", x: 50, y: 50 },
    { id: "2", content: "Card B", x: 180, y: 100 },
    { id: "3", content: "Card C", x: 300, y: 150 },
  ])

  const [dragCardId, setDragCardId] = useState<string | null>(null)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  // Called when dragging starts
  const handleDragStart = (e: DragEvent<HTMLDivElement>, card: CardData) => {
    setDragCardId(card.id)

    // Calculate the mouse position offset inside the card
    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
    setOffsetX(e.clientX - rect.left)
    setOffsetY(e.clientY - rect.top)

    // Transfer data (not strictly necessary for this logic)
    e.dataTransfer.setData("text/plain", card.id)
  }

  // Called repeatedly when dragging over our container
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    // Must prevent default for onDrop to work
    e.preventDefault()
  }

  // Called when we drop anywhere in the container
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!dragCardId) return

    // Calculate new position
    const containerRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const dropX = e.clientX - containerRect.left - offsetX
    const dropY = e.clientY - containerRect.top - offsetY

    setCards((prev) => {
      const dragged = prev.find((c) => c.id === dragCardId)
      if (!dragged) return prev

      const updatedDragged = { ...dragged, x: dropX, y: dropY }
      const newArray = prev.map((c) => (c.id === dragCardId ? updatedDragged : c))

      // Check overlap
      const overlapped = newArray.find(
        (c) =>
          c.id !== updatedDragged.id &&
          Math.abs(c.x - updatedDragged.x) < CARD_WIDTH &&
          Math.abs(c.y - updatedDragged.y) < CARD_HEIGHT
      )
      if (!overlapped) {
        return newArray
      }

      // Combine
      const combined: CardData = {
        id: `${updatedDragged.id}-${overlapped.id}`,
        content: `${updatedDragged.content}+${overlapped.content}`,
        x: overlapped.x,
        y: overlapped.y,
      }
      return newArray
        .filter((c) => c.id !== updatedDragged.id && c.id !== overlapped.id)
        .concat(combined)
    })
    setDragCardId(null)
  }

  // Called if user drags card out of container or ends drag
  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setDragCardId(null)
  }

  return (
    <div
      className="relative w-[600px] h-[400px] border border-dashed border-gray-400"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          draggable
          onDragStart={(e) => handleDragStart(e, card)}
          onDragEnd={handleDragEnd}
          className={clsx(
            "absolute bg-white border border-gray-300 shadow-md rounded px-2 py-1 cursor-move"
          )}
          style={{
            left: card.x,
            top: card.y,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          }}
        >
          {card.content}
        </div>
      ))}
    </div>
  )
}

export default Html5FreeCombine