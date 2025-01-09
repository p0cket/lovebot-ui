import React, { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import clsx from "clsx"

interface CardData {
  id: string
  content: string
  x: number
  y: number
}

// Because RBD is designed for lists, we store the "fake" list of cards
// but each card has an (x, y). On drag end, we figure out where it was dropped.
const RbdFreeCombine: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([
    { id: "1", content: "Card A", x: 50, y: 50 },
    { id: "2", content: "Card B", x: 150, y: 100 },
    { id: "3", content: "Card C", x: 250, y: 150 },
  ])

  const getStyle = (card: CardData, isDragging: boolean) => ({
    position: "absolute" as const,
    left: card.x,
    top: card.y,
    opacity: isDragging ? 0.5 : 1,
  })

  // Overlap check
  const isOverlapping = (
    a: CardData,
    b: CardData,
    buffer = 50 // approximate card width/height
  ) => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.abs(dx) < buffer && Math.abs(dy) < buffer
  }

  // React Beautiful DnD's main callback
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result
    if (!destination) {
      // No valid drop. E.g., the user dropped outside the droppable
      return
    }

    // In a real scenario, we’d calculate the actual mouse offset if we want *true* free positioning.
    // RBD only gives us droppable indexes by default. We'll simulate a small offset change here.

    setCards((prev) => {
      const card = prev.find((c) => c.id === draggableId)
      if (!card) return prev

      // We'll do a quick hack: each "destination.index" just moves it by some offset
      // Normally, you'd track the actual pixel offset from onDragUpdate or a custom sensor approach
      // For demonstration, let's move it by 20*(destination.index - source.index).
      const offset = 20 * (destination.index - source.index)

      const newX = card.x + offset
      const newY = card.y + offset

      const updatedCard = { ...card, x: newX, y: newY }

      // Check overlap -> combine if needed
      // Overlap with any other card except itself
      const overlappingCard = prev.find(
        (c) => c.id !== updatedCard.id && isOverlapping(c, updatedCard)
      )

      if (overlappingCard) {
        // Combine
        const newCombinedCard: CardData = {
          id: `${card.id}-${overlappingCard.id}`,
          content: `${card.content}+${overlappingCard.content}`,
          x: overlappingCard.x,
          y: overlappingCard.y,
        }
        return prev
          .filter((c) => c.id !== card.id && c.id !== overlappingCard.id)
          .concat(newCombinedCard)
      } else {
        // Just update position
        return prev.map((c) => (c.id === card.id ? updatedCard : c))
      }
    })
  }

  return (
    <div className="relative w-[600px] h-[400px] border border-dashed border-gray-400">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="h-full w-full">
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={clsx(
                        "bg-white border border-gray-300 shadow-md rounded px-2 py-1 cursor-move"
                      )}
                      style={{
                        ...getStyle(card, snapshot.isDragging),
                        ...provided.draggableProps.style,
                      }}
                    >
                      {card.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default RbdFreeCombine