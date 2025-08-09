'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, RotateCcw, Trophy } from 'lucide-react'

interface Position {
  x: number
  y: number
}

interface MazeGameProps {
  onClose: () => void
}

const MAZE_SIZE = 15
const CELL_SIZE = 20

// Simple maze generation using recursive backtracking
function generateMaze(width: number, height: number): boolean[][] {
  const maze: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(true))
  const visited: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false))
  
  function isValid(x: number, y: number): boolean {
    return x >= 0 && x < width && y >= 0 && y < height
  }
  
  function getNeighbors(x: number, y: number): Position[] {
    const neighbors: Position[] = []
    const directions = [[0, -2], [2, 0], [0, 2], [-2, 0]]
    
    for (const [dx, dy] of directions) {
      const nx = x + dx
      const ny = y + dy
      if (isValid(nx, ny) && !visited[ny][nx]) {
        neighbors.push({ x: nx, y: ny })
      }
    }
    return neighbors
  }
  
  function carve(x: number, y: number): void {
    visited[y][x] = true
    maze[y][x] = false
    
    const neighbors = getNeighbors(x, y)
    
    // Shuffle neighbors
    for (let i = neighbors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]]
    }
    
    for (const neighbor of neighbors) {
      if (!visited[neighbor.y][neighbor.x]) {
        // Carve path between current cell and neighbor
        const wallX = x + (neighbor.x - x) / 2
        const wallY = y + (neighbor.y - y) / 2
        maze[wallY][wallX] = false
        carve(neighbor.x, neighbor.y)
      }
    }
  }
  
  // Start carving from (1, 1)
  carve(1, 1)
  
  // Ensure start and end are open
  maze[1][1] = false
  maze[height - 2][width - 2] = false
  
  return maze
}

export default function MazeGame({ onClose }: MazeGameProps) {
  const [maze, setMaze] = useState<boolean[][]>(() => generateMaze(MAZE_SIZE, MAZE_SIZE))
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 })
  const [exitPos] = useState<Position>({ x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 })
  const [score, setScore] = useState(0)
  const [mazeChanges, setMazeChanges] = useState(0)
  const [gameMessage, setGameMessage] = useState("Navigate to the exit! Use WASD or arrow keys.")
  const gameRef = useRef<HTMLDivElement>(null)

  // Calculate distance to exit
  const distanceToExit = Math.abs(playerPos.x - exitPos.x) + Math.abs(playerPos.y - exitPos.y)

  // Regenerate maze when player gets close to exit
  useEffect(() => {
    if (distanceToExit <= 3 && distanceToExit > 0) {
      const newMaze = generateMaze(MAZE_SIZE, MAZE_SIZE)
      setMaze(newMaze)
      setMazeChanges(prev => prev + 1)
      setGameMessage("Oh no! The maze changed! 😈")
      
      // Clear message after 2 seconds
      setTimeout(() => {
        setGameMessage("Keep trying! The exit keeps moving...")
      }, 2000)
    }
  }, [distanceToExit])

  // Check for win condition
  useEffect(() => {
    if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
      setScore(prev => prev + 100)
      setGameMessage("🎉 You escaped! But there's always another maze...")
      
      setTimeout(() => {
        const newMaze = generateMaze(MAZE_SIZE, MAZE_SIZE)
        setMaze(newMaze)
        setPlayerPos({ x: 1, y: 1 })
        setMazeChanges(0)
        setGameMessage("New maze! Can you escape again?")
      }, 2000)
    }
  }, [playerPos, exitPos])

  const movePlayer = useCallback((dx: number, dy: number) => {
    setPlayerPos(prev => {
      const newX = prev.x + dx
      const newY = prev.y + dy
      
      // Check bounds and walls
      if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE && !maze[newY][newX]) {
        return { x: newX, y: newY }
      }
      return prev
    })
  }, [maze])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault()
          movePlayer(0, -1)
          break
        case 's':
        case 'arrowdown':
          e.preventDefault()
          movePlayer(0, 1)
          break
        case 'a':
        case 'arrowleft':
          e.preventDefault()
          movePlayer(-1, 0)
          break
        case 'd':
        case 'arrowright':
          e.preventDefault()
          movePlayer(1, 0)
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [movePlayer])

  const resetGame = () => {
    const newMaze = generateMaze(MAZE_SIZE, MAZE_SIZE)
    setMaze(newMaze)
    setPlayerPos({ x: 1, y: 1 })
    setScore(0)
    setMazeChanges(0)
    setGameMessage("Fresh start! Navigate to the exit!")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Tiny Maze Challenge
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Score: {score}</span>
            <span>Maze Changes: {mazeChanges}</span>
            <span>Distance to Exit: {distanceToExit}</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">{gameMessage}</p>
            <div className="flex justify-center gap-2">
              <Button onClick={resetGame} size="sm" variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div 
              ref={gameRef}
              className="relative border-2 border-gray-300 bg-gray-100"
              style={{
                width: MAZE_SIZE * CELL_SIZE,
                height: MAZE_SIZE * CELL_SIZE,
              }}
              tabIndex={0}
            >
              {/* Render maze */}
              {maze.map((row, y) =>
                row.map((isWall, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`absolute ${isWall ? 'bg-gray-800' : 'bg-white'}`}
                    style={{
                      left: x * CELL_SIZE,
                      top: y * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                  />
                ))
              )}
              
              {/* Exit */}
              <div
                className="absolute bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg"
                style={{
                  left: exitPos.x * CELL_SIZE + 2,
                  top: exitPos.y * CELL_SIZE + 2,
                  width: CELL_SIZE - 4,
                  height: CELL_SIZE - 4,
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 animate-spin" 
                     style={{ animationDuration: '3s' }}>
                  <div className="w-full h-full rounded-full bg-yellow-400 flex items-center justify-center text-xs">
                    🏁
                  </div>
                </div>
              </div>
              
              {/* Player */}
              <div
                className={`absolute bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg transition-all duration-150 ${
                  distanceToExit <= 3 ? 'animate-bounce' : ''
                }`}
                style={{
                  left: playerPos.x * CELL_SIZE + 2,
                  top: playerPos.y * CELL_SIZE + 2,
                  width: CELL_SIZE - 4,
                  height: CELL_SIZE - 4,
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs">
                  🔵
                </div>
              </div>
              
              {/* Warning indicator when close to exit */}
              {distanceToExit <= 3 && distanceToExit > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
                  ⚠️ Maze will change!
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Use WASD or arrow keys to move • The maze changes when you get close to the exit!
            </p>
            <div className="mt-2 flex justify-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                You
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                Exit
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-800"></div>
                Wall
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
