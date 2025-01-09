import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material"
// import ClearIcon from "@mui/icons-material/Clear"

const LOG_LEVELS = {
  INFO: { color: "primary" },
  WARN: { color: "warning" },
  ERROR: { color: "error" },
  DEBUG: { color: "default" },
}

const THEMES = {
  light: { bg: "#ffffff", text: "#000000" },
  dark: { bg: "#333333", text: "#ffffff" },
  matrix: { bg: "#000000", text: "#00ff00" },
}

const DebugLogger = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [logs, setLogs] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("INFO")
  const [filter, setFilter] = useState("")
  const [theme, setTheme] = useState("light")

  const addLog = (content: string, level = selectedLevel) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, { id: Date.now(), timestamp, content, level }])
  }

  const handleLogText = () => {
    if (!input.trim()) return
    addLog(input)
    setInput("")
  }

  const copyToClipboard = () => {
    const logText = logs
      .map((log) => `[${log.timestamp}] [${log.level}] ${log.content}`)
      .join("\n")
    navigator.clipboard.writeText(logText)
  }

  const exportLogs = () => {
    const logText = logs
      .map((log) => `[${log.timestamp}] [${log.level}] ${log.content}`)
      .join("\n")
    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `debug-logs-${new Date().toISOString()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredLogs = logs.filter((log) => {
    const lowerFilter = filter.toLowerCase()
    return (
      log.content.toLowerCase().includes(lowerFilter) ||
      log.level.toLowerCase().includes(lowerFilter)
    )
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            width: 400,
            backgroundColor: THEMES[theme].bg,
            color: THEMES[theme].text,
          }}
        >
          <Paper elevation={3}>
            <Box p={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box fontSize="1.2rem" fontWeight="bold">
                  Debug Logger
                </Box>
                <IconButton size="small" onClick={() => setIsOpen(false)}>
                  {/* <ClearIcon /> */}X
                </IconButton>
              </Box>

              <Box display="flex" gap={1} mt={2}>
                <TextField
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter log message..."
                  onKeyPress={(e) => e.key === "Enter" && handleLogText()}
                  size="small"
                  fullWidth
                />
                <FormControl size="small">
                  <InputLabel>Level</InputLabel>
                  <Select
                    label="Level"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as string)}
                  >
                    {Object.keys(LOG_LEVELS).map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                <TextField
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter logs..."
                  size="small"
                  fullWidth
                />
                <FormControl size="small">
                  <InputLabel>Theme</InputLabel>
                  <Select
                    label="Theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as string)}
                  >
                    {Object.keys(THEMES).map((t) => (
                      <MenuItem key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  onClick={copyToClipboard}
                  size="small"
                  variant="contained"
                >
                  Copy
                </Button>
                <Button onClick={exportLogs} size="small" variant="contained">
                  Export
                </Button>
                <Button
                  onClick={() => setLogs([])}
                  size="small"
                  variant="outlined"
                >
                  Clear
                </Button>
              </Box>

              <Box
                mt={2}
                sx={{
                  maxHeight: 300,
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  padding: 1,
                }}
              >
                {filteredLogs.length === 0 ? (
                  <Box textAlign="center" py={2} sx={{ opacity: 0.5 }}>
                    No logs yet
                  </Box>
                ) : (
                  filteredLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Box mt={1}>
                        <Box fontSize="0.75rem" sx={{ opacity: 0.7 }}>
                          {log.timestamp}
                        </Box>
                        <Chip
                          label={log.level}
                          color={LOG_LEVELS[log.level].color}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                        <Box
                          component="pre"
                          sx={{ fontFamily: "monospace", margin: 0 }}
                        >
                          {log.content}
                        </Box>
                      </Box>
                    </motion.div>
                  ))
                )}
              </Box>
            </Box>
          </Paper>
        </motion.div>
      )}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            padding: "8px",
            backgroundColor: "#1976d2",
            color: "#fff",
            borderRadius: "50%",
          }}
        >
          Debug
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default DebugLogger
