import React, { useState, DragEvent } from "react"
import clsx from "clsx"

interface CardData {
    id: string
    content: string
}

interface Html5CardCombineProps {
    initialCards?: CardData[]
}

const Html5CardCombine: React.FC<Html5CardCombineProps> = ({
    initialCards = [
        { id: "1", content: "Item 1" },
        { id: "2", content: "Item 2" },
        { id: "3", content: "Item 3" }
    ],
}) => {
    const [cards, setCards] = useState<CardData[]>(initialCards)
    const [draggedId, setDraggedId] = useState<string | null>(null)

    const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
        setDraggedId(id)
        e.dataTransfer.setData("text/plain", id)
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>, targetId: string) => {
        e.preventDefault()
        const sourceId = draggedId
        if (!sourceId || sourceId === targetId) return

        setCards((prev) => {
            const sourceCard = prev.find((c) => c.id === sourceId)
            const targetCard = prev.find((c) => c.id === targetId)
            if (!sourceCard || !targetCard) return prev

            const newContent = `${sourceCard.content}+${targetCard.content}`
            const newId = `${sourceId}-${targetId}`
            const newCard: CardData = { id: newId, content: newContent }

            return prev
                .filter((c) => c.id !== sourceId && c.id !== targetId)
                .concat(newCard)
        })

        setDraggedId(null)
    }

    return (
        <div className="flex gap-4 p-4">
            {cards.map((card) => (
                <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, card.id)}
                    className={clsx(
                        "bg-white border border-gray-300 rounded px-3 py-2 shadow-md cursor-move"
                    )}
                >
                    {card.content}
                </div>
            ))}
        </div>
    )
}

export default Html5CardCombine