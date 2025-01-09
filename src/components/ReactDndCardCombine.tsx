import React, { useState } from "react"
import { useDrag, useDrop, DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import clsx from "clsx"

// Types
interface CardData {
  id: string
  content: string
  x: number
  y: number
}

interface DragItem {
  id: string
  type: string
}

const DraggableCard: React.FC<{
  card: CardData
  onCombine: (sourceId: string, targetId: string) => void
}> = ({ card, onCombine }) => {
  // useDrag
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "CARD",
    item: { id: card.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  // useDrop
  const [, dropRef] = useDrop(() => ({
    accept: "CARD",
    drop: (draggedItem: DragItem) => {
      if (draggedItem.id !== card.id) {
        onCombine(draggedItem.id, card.id)
      }
    },
  }))

  // Combine the two refs so card is both drag source & drop target
  const cardRef = (node: HTMLDivElement | null) => {
    dragRef(node)
    dropRef(node)
  }

  return (
    <div
      ref={cardRef}
      className={clsx(
        "absolute",
        "bg-white border border-gray-300 shadow-md rounded px-2 py-1 cursor-move",
        "transition-opacity duration-300"
      )}
      style={{
        left: card.x,
        top: card.y,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {card.content}
    </div>
  )
}

const ReactDndCardCombine: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([
    { id: "1", content: "Card A", x: 50, y: 50 },
    { id: "2", content: "Card B", x: 250, y: 80 },
    { id: "3", content: "Card C", x: 150, y: 200 },
  ])

  const handleCombine = (sourceId: string, targetId: string) => {
    setCards((prev) => {
      const sourceCard = prev.find((c) => c.id === sourceId)
      const targetCard = prev.find((c) => c.id === targetId)
      if (!sourceCard || !targetCard) return prev

      const newContent = `${sourceCard.content}+${targetCard.content}`
      const newId = `${sourceId}-${targetId}`
      const newCard: CardData = {
        id: newId,
        content: newContent,
        x: targetCard.x,
        y: targetCard.y,
      }

      // Remove old cards; add the new combined card
      return prev
        .filter((c) => c.id !== sourceId && c.id !== targetId)
        .concat(newCard)
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative w-[600px] h-[400px] border border-dashed border-gray-400 overflow-hidden">
        {cards.map((card) => (
          <DraggableCard
            key={card.id}
            card={card}
            onCombine={handleCombine}
          />
        ))}
      </div>
    </DndProvider>
  )
}

export default ReactDndCardCombine