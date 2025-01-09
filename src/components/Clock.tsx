import { FC, useState, useEffect, useRef } from "react"

export interface ClockProps {
  size?: number
  borderColor?: string
  topHalfColor?: string
  bottomHalfColor?: string
  handColor?: string
  speedFactor?: number
  initialPaused?: boolean
  className?: string
}

const Clock: FC<ClockProps> = ({
  size = 48,
  borderColor = "border-gray-200",
  topHalfColor = "bg-yellow-100",
  bottomHalfColor = "bg-gray-800",
  handColor = "bg-white",
  speedFactor = 300000,
  initialPaused = false,
  className = "",
}) => {
  const [rotation, setRotation] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(initialPaused)
  const lastTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (isPaused) return
    const animate = () => {
      const now = Date.now()
      const delta = now - lastTimeRef.current
      lastTimeRef.current = now
      setRotation((prev) => (prev + (delta / speedFactor) * 360) % 360)
      requestAnimationFrame(animate)
    }
    const frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [isPaused, speedFactor])

  const hours = Math.floor((rotation / 360) * 24)
  const minutes = Math.floor(((rotation / 360) * 24 * 60) % 60)

  return (
    <div className={`flex flex-col items-center gap-4 p-6 ${className}`}>
      <div
        className={`relative rounded-full border-2 overflow-hidden ${borderColor}`}
        style={{ width: size, height: size }}
      >
        <div className={`absolute top-0 left-0 w-full h-1/2 ${topHalfColor}`} />
        <div
          className={`absolute bottom-0 left-0 w-full h-1/2 ${bottomHalfColor}`}
        />
        <div
          className={`absolute top-1/2 left-1/2 w-1 shadow-lg ${handColor}`}
          style={{
            height: size / 2,
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
            transformOrigin: "bottom",
          }}
        />
      </div>
      <div className="text-xl font-mono">
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
      </div>
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isPaused ? "Play" : "Pause"}
      </button>
    </div>
  )
}

export default Clock
