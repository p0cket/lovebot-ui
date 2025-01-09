import React, { useState, useEffect, useRef } from "react"
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Card, CardContent, Button } from "@mui/material"

const SYMBOLS = ["🍎", "🍋", "🍒", "💎", "7️⃣", "🍀", "🎰", "⭐"]
const REEL_COUNT = 3
const SPIN_INTERVAL = 50 // ms between symbol changes

const SlotMachine = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [reels, setReels] = useState(Array(REEL_COUNT).fill(0))
  const [stoppedReels, setStoppedReels] = useState(new Set())
  const [result, setResult] = useState("")

  // Use intervals for more consistent rapid updates
  const spinIntervals = useRef<NodeJS.Timeout[]>([])
  const finalPositions = useRef<number[]>([])

  useEffect(() => {
    // Cleanup intervals on unmount
    return () => {
      spinIntervals.current.forEach((interval) => clearInterval(interval))
    }
  }, [])

  const startSpin = () => {
    setIsSpinning(true)
    setStoppedReels(new Set())
    setResult("")

    // Start spinning each reel with rapid symbol changes
    reels.forEach((_, index) => {
      const interval = setInterval(() => {
        setReels((prev) => {
          const newReels = [...prev]
          newReels[index] = Math.floor(Math.random() * SYMBOLS.length)
          return newReels
        })
      }, SPIN_INTERVAL)

      spinIntervals.current[index] = interval
    })
  }

  const stopSpin = () => {
    setIsSpinning(false)

    // Generate final positions when stop is pressed
    finalPositions.current = Array(REEL_COUNT)
      .fill(0)
      .map(() => Math.floor(Math.random() * SYMBOLS.length))

    // Stop reels in sequence
    reels.forEach((_, index) => {
      setTimeout(() => {
        // Clear the spinning interval for this reel
        clearInterval(spinIntervals.current[index])

        // Set final position
        setReels((prev) => {
          const newReels = [...prev]
          newReels[index] = finalPositions.current[index]
          return newReels
        })

        // Mark reel as stopped
        setStoppedReels((prev) => new Set([...prev, index]))

        // Check for win when last reel stops
        if (index === REEL_COUNT - 1) {
          setTimeout(() => {
            const allSame = finalPositions.current.every(
              (pos) => pos === finalPositions.current[0]
            )
            setResult(allSame ? "🎉 JACKPOT! 🎉" : "Try again!")
          }, 500)
        }
      }, index * 500) // 500ms delay between each reel stopping
    })
  }

  //   return (
  //     <Card className="w-96">
  //       <CardContent className="p-6">
  //         <div className="flex justify-center mb-6 bg-gray-800 p-4 rounded-lg">
  //           {reels.map((symbolIndex, i) => (
  //             <div
  //               key={i}
  //               className={`
  //                 w-20 h-20 mx-1 bg-white rounded-lg
  //                 flex items-center justify-center text-4xl
  //                 transition-transform duration-200
  //                 ${stoppedReels.has(i) ? 'scale-105 border-2 border-yellow-400' : 'scale-100'}
  //                 ${isSpinning && !stoppedReels.has(i) ? 'blur-[2px]' : ''}
  //               `}
  //             >
  //               {SYMBOLS[symbolIndex]}
  //             </div>
  //           ))}
  //         </div>

  //         <div className="text-center space-y-4">
  //           {!isSpinning ? (
  //             <Button
  //               onClick={startSpin}
  //               className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-xl font-bold"
  //             >
  //               SPIN!
  //             </Button>
  //           ) : (
  //             <Button
  //               onClick={stopSpin}
  //               className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-xl font-bold"
  //             >
  //               STOP!
  //             </Button>
  //           )}

  //           {result && (
  //             <div className="text-xl font-bold animate-bounce">
  //               {result}
  //             </div>
  //           )}
  //         </div>
  //       </CardContent>
  //     </Card>

  // Update the return statement to:
  return (
    <Card sx={{ width: 384 }}>
      <CardContent sx={{ p: 3 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
            backgroundColor: "#1e1e1e",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          {reels.map((symbolIndex, i) => (
            <div
              key={i}
              style={{
                width: "80px",
                height: "80px",
                margin: "0 4px",
                backgroundColor: "white",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                transform: stoppedReels.has(i) ? "scale(1.05)" : "scale(1)",
                border: stoppedReels.has(i) ? "2px solid #ffd700" : "none",
                filter:
                  isSpinning && !stoppedReels.has(i) ? "blur(2px)" : "none",
                transition: "transform 0.2s",
              }}
            >
              {SYMBOLS[symbolIndex]}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          {!isSpinning ? (
            <Button
              onClick={startSpin}
              variant="contained"
              sx={{
                backgroundColor: "#2e7d32",
                "&:hover": { backgroundColor: "#1b5e20" },
                padding: "16px 32px",
                borderRadius: "28px",
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              SPIN!
            </Button>
          ) : (
            <Button
              onClick={stopSpin}
              variant="contained"
              sx={{
                backgroundColor: "#d32f2f",
                "&:hover": { backgroundColor: "#c62828" },
                padding: "16px 32px",
                borderRadius: "28px",
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: 2,
              }}
            >
              STOP!
            </Button>
          )}

          {result && (
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                animation: "bounce 1s infinite",
              }}
            >
              {result}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SlotMachine
