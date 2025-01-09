import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Timer, Pickaxe, Home, Coins } from "lucide-react"

type MiningState = "idle" | "moving" | "mining" | "returning"

interface MiningSimulationProps {
  mineDuration?: number
  mineAmount?: number
  workerSpeed?: number
  initialResources?: number
  baseImage?: string
  resourceImage?: string
}

const MiningSimulation: React.FC<MiningSimulationProps> = ({
  mineDuration = 3000,
  mineAmount = 10,
  workerSpeed = 2000,
  initialResources = 0,
  baseImage = "https://picsum.photos/64",
  resourceImage = "https://picsum.photos/64",
}) => {
  const [resources, setResources] = useState<number>(initialResources)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [miningState, setMiningState] = useState<MiningState>("idle")
  const [progress, setProgress] = useState<number>(0)

  const positions = {
    idle: { x: 0, y: 0 },
    mining: { x: 320, y: 0 },
    returning: { x: 0, y: 0 },
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (isActive) {
      const cycleMining = async () => {
        setMiningState("moving")
        await new Promise((resolve) => setTimeout(resolve, workerSpeed))

        setMiningState("mining")
        const startTime = Date.now()

        timer = setInterval(() => {
          const elapsed = Date.now() - startTime
          const newProgress = (elapsed / mineDuration) * 100

          if (elapsed >= mineDuration) {
            clearInterval(timer)
            setProgress(0)
            setMiningState("returning")

            setTimeout(() => {
              setResources((prev) => prev + mineAmount)
              setMiningState("idle")
              if (isActive) cycleMining()
            }, workerSpeed)
          } else {
            setProgress(newProgress)
          }
        }, 50)
      }
      cycleMining()
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isActive, mineDuration, mineAmount, workerSpeed])

  const getStateIcon = () => {
    switch (miningState) {
      case "mining":
        return <Pickaxe className="w-6 h-6" />
      case "returning":
        return <Home className="w-6 h-6" />
      default:
        return <Timer className="w-6 h-6" />
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isActive
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isActive ? "Stop Mining" : "Start Mining"}
        </button>

        <div className="flex items-center space-x-2">
          <Coins className="w-6 h-6 text-yellow-500" />
          <span className="text-xl font-bold">{resources}</span>
        </div>
      </div>

      <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16">
          <img
            src={baseImage}
            alt="Base"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16">
          <img
            src={resourceImage}
            alt="Resource"
            className="w-full h-full object-cover rounded-lg"
          />
          {miningState === "mining" && (
            <motion.div
              className="absolute inset-0 bg-yellow-500 opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        <AnimatePresence>
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
            animate={
              positions[miningState === "moving" ? "mining" : miningState]
            }
            transition={{ duration: workerSpeed / 1000, ease: "linear" }}
          >
            {getStateIcon()}
          </motion.div>
        </AnimatePresence>

        {miningState === "mining" && (
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="capitalize font-medium">
            Status: {miningState.replace(/([A-Z])/g, " $1").trim()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MiningSimulation
