import React, { useState } from "react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react"
import { motion } from "framer-motion"

type DiceSize = "small" | "medium" | "large"

interface DiceRollProps {
  size?: DiceSize
}

const diceSizeMap = {
  small: "w-16 h-16",
  medium: "w-24 h-24",
  large: "w-32 h-32",
}

const cardSizeMap = {
  small: "w-48",
  medium: "w-64",
  large: "w-80",
}

const DiceRoll: React.FC<DiceRollProps> = ({ size = "medium" }) => {
  const [currentValue, setCurrentValue] = useState<number>(1)
  const [isRolling, setIsRolling] = useState<boolean>(false)

  const diceIcons: { [key: number]: JSX.Element } = {
    1: <Dice1 className={diceSizeMap[size]} />,
    2: <Dice2 className={diceSizeMap[size]} />,
    3: <Dice3 className={diceSizeMap[size]} />,
    4: <Dice4 className={diceSizeMap[size]} />,
    5: <Dice5 className={diceSizeMap[size]} />,
    6: <Dice6 className={diceSizeMap[size]} />,
  }

  const rollDice = () => {
    if (isRolling) return

    setIsRolling(true)

    let rollCount = 0
    const maxRolls = 10
    const interval = setInterval(() => {
      setCurrentValue(Math.floor(Math.random() * 6) + 1)
      rollCount++

      if (rollCount >= maxRolls) {
        clearInterval(interval)
        const finalValue = Math.floor(Math.random() * 6) + 1
        setCurrentValue(finalValue)
        setIsRolling(false)
      }
    }, 100)
  }

  return (
    <Card
      className={`${cardSizeMap[size]} bg-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <CardHeader>
        <Typography
          variant="h5"
          component="div"
          className="text-center font-bold text-indigo-600 hover:text-indigo-800"
        >
          <span className="text-red-400">Dice</span>{" "}
          <span className="text-green-800">Roller</span>
        </Typography>
      </CardHeader>
    <CardContent className="flex flex-col items-center gap-4 p-6 bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        className="p-4 rounded-lg bg-gray-100 hover:bg-gray-200"
        animate={isRolling ? {
        y: [0, -20, 0],
        } : {}}
        transition={{
        duration: 0.6,
        repeat: Infinity,
        repeatType: "loop"
        }}
      >
        {diceIcons[currentValue]}
      </motion.div>
      <Button
        onClick={rollDice}
        disabled={isRolling}
        variant="contained"
        fullWidth
      >
        {isRolling ? "Rolling..." : "Roll Dice"}
      </Button>
    </CardContent>
    </Card>
  )
}

export default DiceRoll
