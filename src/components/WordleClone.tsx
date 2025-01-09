import { FC, useState, useEffect } from "react"
import { Alert } from "@mui/material"

interface WordleGameProps {
  wordList?: string[]
  maxGuesses?: number
  title?: string
  defaultMessage?: string
}

const WordleClone: FC<WordleGameProps> = ({
  wordList = ["REACT", "CLONE", "WORLD", "PILOT", "STEAM", "BRAIN", "CLOUD"],
  maxGuesses = 6,
  title = "Wordle Clone",
  defaultMessage = "",
}) => {
  const [targetWord, setTargetWord] = useState("")
  const [guesses, setGuesses] = useState<string[]>(Array(maxGuesses).fill(""))
  const [currentGuess, setCurrentGuess] = useState("")
  const [currentRow, setCurrentRow] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState(defaultMessage)

  useEffect(() => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)]
    setTargetWord(randomWord)
  }, [wordList])

  const handleKeyPress = (key: string) => {
    if (gameOver) return
    if (key === "ENTER") {
      if (currentGuess.length !== 5) {
        setMessage("Word must be 5 letters")
        return
      }
      const newGuesses = [...guesses]
      newGuesses[currentRow] = currentGuess
      setGuesses(newGuesses)
      if (currentGuess === targetWord) {
        setMessage("Congratulations! You won!")
        setGameOver(true)
        return
      }
      if (currentRow === maxGuesses - 1) {
        setGameOver(true)
        setMessage(`Game Over! The word was ${targetWord}`)
        return
      }
      setCurrentRow(currentRow + 1)
      setCurrentGuess("")
    } else if (key === "BACKSPACE") {
      setCurrentGuess(currentGuess.slice(0, -1))
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key)
    }
  }

  const getCellColor = (guess: string, pos: number) => {
    if (!guess) return "bg-gray-200"
    const letter = guess[pos]
    if (!letter) return "bg-gray-200"
    if (letter === targetWord[pos]) return "bg-green-500"
    if (targetWord.includes(letter)) return "bg-yellow-500"
    return "bg-gray-400"
  }

  const keyboard: string[][] = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ]

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {message && (
        <Alert className="mb-4" severity="info">
          {message}
        </Alert>
      )}
      <div className="grid grid-rows-6 gap-1">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-1">
            {Array(5)
              .fill(0)
              .map((_, colIndex) => {
                const letter =
                  rowIndex === currentRow
                    ? currentGuess[colIndex]
                    : guess[colIndex]
                return (
                  <div
                    key={colIndex}
                    className={`w-12 h-12 border-2 flex items-center justify-center font-bold text-lg
                                        ${rowIndex === currentRow ? "border-gray-400" : "border-gray-200"}
                                        ${getCellColor(guess, colIndex)}`}
                  >
                    {letter}
                  </div>
                )
              })}
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-1">
        {keyboard.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`px-2 py-4 rounded font-semibold
                                    ${key.length > 1 ? "w-16" : "w-8"} 
                                    bg-gray-200 hover:bg-gray-300 active:bg-gray-400`}
              >
                {key === "BACKSPACE" ? "←" : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WordleClone
