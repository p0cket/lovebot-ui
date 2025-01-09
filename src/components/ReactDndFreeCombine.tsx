import React, { useState, useRef } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import clsx from "clsx"

interface CardData {
  id: string
  content: string
  x: number
  y: number
}

interface DragItem {
  id: string
  originalX: number
  originalY: number
  offsetX: number
  offsetY: number
  type: string
}

const CARD_TYPE = "CARD"

const DraggableCard: React.FC<{
  card: CardData
  onCombine: (sourceId: string, targetId: string) => void
  onMove: (id: string, x: number, y: number) => void
}> = ({ card, onCombine, onMove }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: CARD_TYPE,
      item: () => ({
        id: card.id,
        originalX: card.x,
        originalY: card.y,
        offsetX: 0,
        offsetY: 0,
      }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item: DragItem | undefined, monitor) => {
        if (!item) return
        const dropResult = monitor.getDropResult()
        // If dropResult is null => item was dropped outside any specific drop target
        // but we have a parent drop zone that covers the entire container (below).
        if (!dropResult) return

        const { deltaX, deltaY } = dropResult
        const finalX = item.originalX + deltaX
        const finalY = item.originalY + deltaY

        // We call onMove to finalize the new position
        onMove(item.id, finalX, finalY)
      },
    }),
    [card, onMove]
  )

  // Also set up a drop target to detect combination (if dropped on top)
  const [, dropRef] = useDrop(
    () => ({
      accept: CARD_TYPE,
      drop: (draggedItem: DragItem) => {
        // If the dragged item is not the same card, combine them
        if (draggedItem.id !== card.id) {
          onCombine(draggedItem.id, card.id)
        }
      },
      // We do not specify a dropResult here for the "combine" target
      // because the parent container sets the main dropResult for positioning.
    }),
    [card, onCombine]
  )

  // Combine dragRef + dropRef
  const cardRef = (node: HTMLDivElement | null) => {
    dragRef(node)
    dropRef(node)
  }

  return (
    <div
      ref={cardRef}
      className={clsx(
        "absolute",
        "bg-white border border-gray-300 shadow-md rounded px-2 py-1 cursor-move"
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

const ReactDndFreeCombine: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([
    { id: "1", content: "Card A", x: 50, y: 50 },
    { id: "2", content: "Card B", x: 150, y: 100 },
    { id: "3", content: "Card C", x: 250, y: 150 },
  ])

  // Our drop container
  const [, dropContainerRef] = useDrop({
    accept: CARD_TYPE,
    // This drop target calculates the final position offset for the card
    drop: (item: DragItem, monitor) => {
      // getDifferenceFromInitialOffset gives the delta (x, y)
      const delta = monitor.getDifferenceFromInitialOffset()
      if (!delta) return undefined
      const { x, y } = delta
      return { deltaX: x, deltaY: y }
    },
  })

  // Combine logic
  const handleCombine = (sourceId: string, targetId: string) => {
    setCards((prev) => {
      const source = prev.find((c) => c.id === sourceId)
      const target = prev.find((c) => c.id === targetId)
      if (!source || !target) return prev
      const newCard: CardData = {
        id: `${source.id}-${target.id}`,
        content: `${source.content}+${target.content}`,
        x: target.x,
        y: target.y,
      }
      return prev
        .filter((c) => c.id !== sourceId && c.id !== targetId)
        .concat(newCard)
    })
  }

  // On final position, update our state
  const handleMove = (id: string, x: number, y: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x, y } : c))
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={dropContainerRef}
        className="relative w-[600px] h-[400px] border border-dashed border-gray-400"
      >
        {cards.map((card) => (
          <DraggableCard
            key={card.id}
            card={card}
            onCombine={handleCombine}
            onMove={handleMove}
          />
        ))}
      </div>
    </DndProvider>
  )
}

export default ReactDndFreeCombine