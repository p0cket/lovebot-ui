import React, { useState } from "react"

interface LogEntry {
    timestamp: string
    level: "info" | "debug" | "error" | "warn" | "trace"
    event: string
    data: unknown
}

interface ExpandedState {
    [index: number]: boolean
}

const LogDisplayer: React.FC = () => {
    const sampleLogs: LogEntry[] = [
        {
            timestamp: "2024-01-07T12:00:00.123Z",
            level: "info",
            event: "request.start",
            data: {
                method: "POST",
                path: "/api/users",
                headers: { "content-type": "application/json" },
                body: { username: "alice", email: "alice@example.com" },
            },
        },
        {
            timestamp: "2024-01-07T12:00:00.125Z",
            level: "debug",
            event: "auth.verify",
            data: {
                token: "eyJhbG...truncated",
                user: { id: "u_123", role: "admin" },
            },
        },
        {
            timestamp: "2024-01-07T12:00:00.127Z",
            level: "error",
            event: "db.query.failed",
            data: {
                query: "INSERT INTO users...",
                error: {
                    code: "23505",
                    message: "duplicate key value violates unique constraint",
                    detail: "Key (email)=(alice@example.com) already exists",
                },
                stack: [
                    "at PostgresError (pg/lib:192:12)",
                    "at Connection.parseE (pg/lib:215:19)",
                    "at Connection.parseMessage (pg/lib:315:19)",
                ],
            },
        },
    ]

    const [expanded, setExpanded] = useState<ExpandedState>({})

    const toggleExpand = (index: number) => {
        setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))
    }

    const levelColors: Record<string, string> = {
        error: "text-red-400",
        warn: "text-yellow-400",
        info: "text-blue-400",
        debug: "text-gray-400",
        trace: "text-gray-500",
    }

    // 
    const renderValue = (value: unknown): React.ReactNode => {
        if (value === null) return <span className="text-gray-500">∅</span>
        if (typeof value === "boolean")
            return <span className="text-purple-400">{value ? "✓" : "✗"}</span>
        if (typeof value === "number")
            return <span className="text-green-400">{value}</span>
        if (typeof value === "string") {
            if (value.length > 50)
                return <span className="text-gray-400">{value.slice(0, 47)}...</span>
            return <span className="text-gray-400">{value}</span>
        }
        if (Array.isArray(value)) {
            if (value.length === 0) return <span className="text-gray-600">[]</span>
            return <span className="text-gray-600">[{value.length}]</span>
        }
        if (typeof value === "object") {
            const keys = Object.keys(value)
            if (keys.length === 0) return <span className="text-gray-600">{"{}"}</span>
            return <span className="text-gray-600">{`{${keys.length}}`}</span>
        }
        return String(value)
    }

    const renderObject = (obj: unknown, level = 0): React.ReactNode => {
        return Object.entries(obj).map(([key, val]) => (
            <div key={key} className="ml-2 leading-none">
                <span className="text-blue-400">{key}</span>
                <span className="text-gray-500">: </span>
                {typeof val === "object" && val !== null
                    ? renderObject(val, level + 1)
                    : renderValue(val)}
            </div>
        ))
    }

    return (
        <div className="w-full max-w-4xl bg-gray-900 text-white font-mono text-xs">
            {sampleLogs.map((log, index) => {
                const isExpanded = expanded[index]
                const timestamp = new Date(log.timestamp)
                const timeStr = `${timestamp.getHours().toString().padStart(2, "0")}:${timestamp
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}:${timestamp
                    .getSeconds()
                    .toString()
                    .padStart(2, "0")}.${timestamp
                    .getMilliseconds()
                    .toString()
                    .padStart(3, "0")}`

                return (
                    <div
                        key={index}
                        className={`border-b border-gray-800 py-0.5 ${
                            index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                        }`}
                    >
                        <div
                            onClick={() => toggleExpand(index)}
                            className="cursor-pointer flex items-start hover:bg-gray-700 px-1"
                        >
                            <span className="text-gray-500 mr-2">{timeStr}</span>
                            <span className={`${levelColors[log.level]} w-12 mr-2`}>
                                {log.level}
                            </span>
                            <span className="text-gray-300 mr-2">{log.event}</span>
                            {!isExpanded && (
                                <span className="text-gray-600">
                                    {JSON.stringify(log.data).slice(0, 60)}...
                                </span>
                            )}
                        </div>
                        {isExpanded && (
                            <div className="pl-24 text-gray-400 leading-none">
                                {renderObject(log.data)}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default LogDisplayer
