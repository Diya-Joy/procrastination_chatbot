'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Gamepad2 } from 'lucide-react'
import MazeGame from './components/maze-game'
import MiniGames from './components/mini-games'
import UselessFacts from './components/useless-facts'
import ThemedModes from './components/themed-modes'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function ProcrastinationBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there! 🤖 I'm your Procrastination Bot! Tell me about any plans or ideas you have, and I'll give you creative reasons to put them off! What's on your mind?",
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [procrastinationProgress, setProcrastinationProgress] = useState(0)
  const [lastActivityTime, setLastActivityTime] = useState(Date.now())
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [showMazeGame, setShowMazeGame] = useState(false)
  const [showMiniGames, setShowMiniGames] = useState(false)
  const [showUselessFacts, setShowUselessFacts] = useState(false)
  const [showThemedModes, setShowThemedModes] = useState(false)

  // Procrastination Progress Bar Logic
  useEffect(() => {
    const updateProgress = () => {
      const now = Date.now()
      const timeSinceActivity = now - lastActivityTime
      const secondsInactive = Math.floor(timeSinceActivity / 1000)
      
      // Progress increases every 2 seconds of inactivity, max 100%
      const newProgress = Math.min((secondsInactive / 2) * 10, 100)
      setProcrastinationProgress(newProgress)
    }

    // Update progress every 500ms for smooth animation
    progressIntervalRef.current = setInterval(updateProgress, 500)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [lastActivityTime])

  // Reset activity timer on any user interaction
  const resetActivity = () => {
    setLastActivityTime(Date.now())
  }

  // Add event listeners for user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, resetActivity, true)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetActivity, true)
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    resetActivity() // Add this line

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Oops! Even I'm procrastinating on giving you a response! Try again? 😅",
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[90vh] flex flex-col shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">Procrastination Bot 🤖</CardTitle>
                  <p className="text-purple-100">Your friendly companion for creative procrastination!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowMiniGames(true)}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Mini Games
                </Button>
                <Button
                  onClick={() => setShowMazeGame(true)}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  🧩 Maze
                </Button>
                <Button
                  onClick={() => setShowUselessFacts(true)}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  🧠 Facts
                </Button>
                <Button
                  onClick={() => setShowThemedModes(true)}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  🎭 Modes
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {/* Procrastination Progress Bar */}
          <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700">
                Procrastination Level 🎯
              </span>
              <span className="text-sm text-purple-600">
                {Math.round(procrastinationProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{ 
                  width: `${procrastinationProgress}%`,
                  animation: procrastinationProgress > 0 ? 'shimmer 2s infinite' : 'none'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              </div>
            </div>
            <div className="text-xs text-center mt-1 text-purple-600">
              {procrastinationProgress < 25 && "Just getting started... 😴"}
              {procrastinationProgress >= 25 && procrastinationProgress < 50 && "Nice procrastination! 🛋️"}
              {procrastinationProgress >= 50 && procrastinationProgress < 75 && "Expert level laziness! 🎮"}
              {procrastinationProgress >= 75 && procrastinationProgress < 100 && "Procrastination master! 🏆"}
              {procrastinationProgress >= 100 && "Ultimate procrastinator! 🎉"}
            </div>
          </div>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-purple-500 text-white'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === 'user'
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tell me about your plans or ideas..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Share your goals and I'll help you find creative ways to postpone them! 😉
              </p>
            </div>
          </CardContent>
        </Card>
        {showMiniGames && (
          <MiniGames onClose={() => setShowMiniGames(false)} />
        )}
        {showMazeGame && (
          <MazeGame onClose={() => setShowMazeGame(false)} />
        )}
        {showUselessFacts && (
          <UselessFacts onClose={() => setShowUselessFacts(false)} />
        )}
        {showThemedModes && (
          <ThemedModes onClose={() => setShowThemedModes(false)} />
        )}
      </div>
    </div>
  )
}
