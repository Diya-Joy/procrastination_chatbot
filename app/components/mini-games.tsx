'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { X, RotateCcw, Trophy, Zap, Target } from 'lucide-react'

interface MiniGamesProps {
  onClose: () => void
}

type GameType = 'menu' | 'rps' | 'guess'
type RPSChoice = 'rock' | 'paper' | 'scissors'

interface GameStats {
  rpsWins: number
  rpsLosses: number
  rpsTies: number
  guessGamesWon: number
  totalGuesses: number
  bestGuessStreak: number
}

export default function MiniGames({ onClose }: MiniGamesProps) {
  const [currentGame, setCurrentGame] = useState<GameType>('menu')
  const [stats, setStats] = useState<GameStats>({
    rpsWins: 0,
    rpsLosses: 0,
    rpsTies: 0,
    guessGamesWon: 0,
    totalGuesses: 0,
    bestGuessStreak: 0
  })

  // Rock Paper Scissors State
  const [playerChoice, setPlayerChoice] = useState<RPSChoice | null>(null)
  const [computerChoice, setComputerChoice] = useState<RPSChoice | null>(null)
  const [rpsResult, setRpsResult] = useState<string>('')
  const [rpsRound, setRpsRound] = useState(0)

  // Guess the Number State
  const [targetNumber, setTargetNumber] = useState<number>(0)
  const [guess, setGuess] = useState('')
  const [guessHistory, setGuessHistory] = useState<Array<{guess: number, hint: string}>>([])
  const [guessResult, setGuessResult] = useState('')
  const [currentStreak, setCurrentStreak] = useState(0)
  const [attemptsLeft, setAttemptsLeft] = useState(7)

  // Initialize guess the number game
  const initGuessGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1)
    setGuess('')
    setGuessHistory([])
    setGuessResult('')
    setAttemptsLeft(7)
  }

  useEffect(() => {
    if (currentGame === 'guess') {
      initGuessGame()
    }
  }, [currentGame])

  // Rock Paper Scissors Logic
  const playRPS = (choice: RPSChoice) => {
    const choices: RPSChoice[] = ['rock', 'paper', 'scissors']
    const computerChoice = choices[Math.floor(Math.random() * 3)]
    
    setPlayerChoice(choice)
    setComputerChoice(computerChoice)
    setRpsRound(prev => prev + 1)

    let result = ''
    if (choice === computerChoice) {
      result = "It's a tie! 🤝"
      setStats(prev => ({ ...prev, rpsTies: prev.rpsTies + 1 }))
    } else if (
      (choice === 'rock' && computerChoice === 'scissors') ||
      (choice === 'paper' && computerChoice === 'rock') ||
      (choice === 'scissors' && computerChoice === 'paper')
    ) {
      result = 'You win! 🎉'
      setStats(prev => ({ ...prev, rpsWins: prev.rpsWins + 1 }))
    } else {
      result = 'Computer wins! 🤖'
      setStats(prev => ({ ...prev, rpsLosses: prev.rpsLosses + 1 }))
    }
    
    setRpsResult(result)
  }

  const resetRPS = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setRpsResult('')
    setRpsRound(0)
  }

  // Guess the Number Logic
  const makeGuess = () => {
    const guessNum = parseInt(guess)
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setGuessResult('Please enter a number between 1 and 100!')
      return
    }

    const newAttempts = attemptsLeft - 1
    setAttemptsLeft(newAttempts)
    setStats(prev => ({ ...prev, totalGuesses: prev.totalGuesses + 1 }))

    let hint = ''
    if (guessNum === targetNumber) {
      hint = '🎉 Correct!'
      setGuessResult(`Congratulations! You guessed it in ${7 - newAttempts} attempts!`)
      setCurrentStreak(prev => prev + 1)
      setStats(prev => ({
        ...prev,
        guessGamesWon: prev.guessGamesWon + 1,
        bestGuessStreak: Math.max(prev.bestGuessStreak, currentStreak + 1)
      }))
      
      setTimeout(() => {
        initGuessGame()
        setGuessResult('New number generated! Keep the streak going!')
      }, 2000)
    } else if (newAttempts === 0) {
      hint = `💀 Game Over!`
      setGuessResult(`The number was ${targetNumber}. Better luck next time!`)
      setCurrentStreak(0)
      
      setTimeout(() => {
        initGuessGame()
        setGuessResult('New game started!')
      }, 3000)
    } else {
      hint = guessNum < targetNumber ? '📈 Too low!' : '📉 Too high!'
      setGuessResult(`${hint} ${newAttempts} attempts left.`)
    }

    setGuessHistory(prev => [...prev, { guess: guessNum, hint }])
    setGuess('')
  }

  const getChoiceEmoji = (choice: RPSChoice) => {
    switch (choice) {
      case 'rock': return '🪨'
      case 'paper': return '📄'
      case 'scissors': return '✂️'
    }
  }

  const renderMenu = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose Your Distraction! 🎮</h3>
        <p className="text-sm text-gray-600 mb-4">Perfect for avoiding that important task...</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
          onClick={() => setCurrentGame('rps')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">🪨📄✂️</div>
            <h4 className="font-semibold">Rock Paper Scissors</h4>
            <p className="text-xs text-gray-600 mt-1">Classic game of chance</p>
            <div className="mt-2 text-xs">
              <div>Wins: {stats.rpsWins} | Losses: {stats.rpsLosses} | Ties: {stats.rpsTies}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300"
          onClick={() => setCurrentGame('guess')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">🎯🔢</div>
            <h4 className="font-semibold">Guess the Number</h4>
            <p className="text-xs text-gray-600 mt-1">1-100, you have 7 tries</p>
            <div className="mt-2 text-xs">
              <div>Games Won: {stats.guessGamesWon} | Best Streak: {stats.bestGuessStreak}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-xs text-gray-500">
        Total Procrastination Points: {stats.rpsWins + stats.guessGamesWon * 10} 🏆
      </div>
    </div>
  )

  const renderRPS = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Rock Paper Scissors 🪨📄✂️</h3>
        <p className="text-sm text-gray-600">Round {rpsRound + 1}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {(['rock', 'paper', 'scissors'] as RPSChoice[]).map((choice) => (
          <Button
            key={choice}
            onClick={() => playRPS(choice)}
            variant="outline"
            className="h-20 text-2xl hover:scale-105 transition-transform"
          >
            <div className="text-center">
              <div>{getChoiceEmoji(choice)}</div>
              <div className="text-xs capitalize">{choice}</div>
            </div>
          </Button>
        ))}
      </div>
      
      {playerChoice && computerChoice && (
        <div className="text-center space-y-2 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-center items-center gap-4">
            <div className="text-center">
              <div className="text-3xl">{getChoiceEmoji(playerChoice)}</div>
              <div className="text-xs">You</div>
            </div>
            <div className="text-2xl">VS</div>
            <div className="text-center">
              <div className="text-3xl">{getChoiceEmoji(computerChoice)}</div>
              <div className="text-xs">Computer</div>
            </div>
          </div>
          <div className="text-lg font-semibold">{rpsResult}</div>
        </div>
      )}
      
      <div className="flex justify-center gap-2">
        <Button onClick={resetRPS} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button onClick={() => setCurrentGame('menu')} variant="outline" size="sm">
          Back to Menu
        </Button>
      </div>
      
      <div className="text-center text-xs text-gray-600">
        Stats: {stats.rpsWins}W - {stats.rpsLosses}L - {stats.rpsTies}T
      </div>
    </div>
  )

  const renderGuessGame = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Guess the Number 🎯</h3>
        <p className="text-sm text-gray-600">I'm thinking of a number between 1-100</p>
        <div className="text-xs mt-1">
          Attempts left: {attemptsLeft} | Current streak: {currentStreak}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess..."
          min="1"
          max="100"
          onKeyPress={(e) => e.key === 'Enter' && makeGuess()}
          className="flex-1"
        />
        <Button onClick={makeGuess} disabled={!guess || attemptsLeft === 0}>
          <Target className="w-4 h-4 mr-2" />
          Guess
        </Button>
      </div>
      
      {guessResult && (
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="font-medium">{guessResult}</div>
        </div>
      )}
      
      {guessHistory.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Guess History:</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {guessHistory.slice(-5).map((entry, index) => (
              <div key={index} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                <span>Guess: {entry.guess}</span>
                <span>{entry.hint}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-center gap-2">
        <Button onClick={initGuessGame} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
        <Button onClick={() => setCurrentGame('menu')} variant="outline" size="sm">
          Back to Menu
        </Button>
      </div>
      
      <div className="text-center text-xs text-gray-600">
        Games Won: {stats.guessGamesWon} | Total Guesses: {stats.totalGuesses} | Best Streak: {stats.bestGuessStreak}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Mini Distraction Games
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
        </CardHeader>
        
        <CardContent className="p-4">
          {currentGame === 'menu' && renderMenu()}
          {currentGame === 'rps' && renderRPS()}
          {currentGame === 'guess' && renderGuessGame()}
        </CardContent>
      </Card>
    </div>
  )
}
