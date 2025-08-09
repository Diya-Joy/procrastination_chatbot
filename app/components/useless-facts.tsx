'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, RefreshCw, Brain, Bookmark, Share2, Copy, Check } from 'lucide-react'

interface UselessFactsProps {
  onClose: () => void
}

interface Fact {
  id: string
  text: string
  source: string
  category: string
  timestamp: Date
  isFavorite?: boolean
}

const FACT_CATEGORIES = [
  'Animals', 'Science', 'History', 'Food', 'Space', 'Human Body', 
  'Technology', 'Nature', 'Random', 'Geography'
]

// Curated collection of useless but fascinating facts
const USELESS_FACTS = [
  { text: "Bananas are berries, but strawberries aren't.", category: "Food", source: "Botanical Science" },
  { text: "A group of flamingos is called a 'flamboyance'.", category: "Animals", source: "Ornithology" },
  { text: "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.", category: "Food", source: "Archaeology" },
  { text: "Octopuses have three hearts and blue blood.", category: "Animals", source: "Marine Biology" },
  { text: "The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.", category: "History", source: "Historical Records" },
  { text: "A single cloud can weigh more than a million pounds.", category: "Science", source: "Meteorology" },
  { text: "Wombat poop is cube-shaped.", category: "Animals", source: "Zoology" },
  { text: "The human brain uses about 20% of the body's total energy.", category: "Human Body", source: "Neuroscience" },
  { text: "There are more possible games of chess than there are atoms in the observable universe.", category: "Science", source: "Mathematics" },
  { text: "A shrimp's heart is in its head.", category: "Animals", source: "Marine Biology" },
  { text: "The Great Wall of China isn't visible from space with the naked eye.", category: "Geography", source: "Space Science" },
  { text: "Dolphins have names for each other.", category: "Animals", source: "Marine Biology" },
  { text: "A day on Venus is longer than its year.", category: "Space", source: "Astronomy" },
  { text: "Bubble wrap was originally invented as wallpaper.", category: "Technology", source: "Innovation History" },
  { text: "The unicorn is Scotland's national animal.", category: "Geography", source: "Cultural History" },
  { text: "A group of pandas is called an 'embarrassment'.", category: "Animals", source: "Zoology" },
  { text: "Your stomach gets an entirely new lining every 3-5 days.", category: "Human Body", source: "Biology" },
  { text: "The longest recorded flight of a chicken is 13 seconds.", category: "Animals", source: "Poultry Science" },
  { text: "There are more trees on Earth than stars in the Milky Way galaxy.", category: "Nature", source: "Astronomy & Botany" },
  { text: "A crocodile cannot stick its tongue out.", category: "Animals", source: "Herpetology" },
  { text: "The word 'set' has the most different meanings in the English language.", category: "Random", source: "Linguistics" },
  { text: "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza.", category: "History", source: "Chronology" },
  { text: "A group of owls is called a 'parliament'.", category: "Animals", source: "Ornithology" },
  { text: "The human eye can distinguish about 10 million colors.", category: "Human Body", source: "Ophthalmology" },
  { text: "Pineapples take two years to grow.", category: "Food", source: "Agriculture" },
  { text: "A bolt of lightning is five times hotter than the surface of the sun.", category: "Science", source: "Physics" },
  { text: "Elephants are afraid of bees.", category: "Animals", source: "Animal Behavior" },
  { text: "The inventor of the Pringles can is buried in one.", category: "Random", source: "Pop Culture" },
  { text: "A group of jellyfish is called a 'smack'.", category: "Animals", source: "Marine Biology" },
  { text: "Your nose can remember 50,000 different scents.", category: "Human Body", source: "Neuroscience" }
]

export default function UselessFacts({ onClose }: UselessFactsProps) {
  const [facts, setFacts] = useState<Fact[]>([])
  const [currentFact, setCurrentFact] = useState<Fact | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [favorites, setFavorites] = useState<Fact[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [factCount, setFactCount] = useState(0)
  const [copied, setCopied] = useState(false)

  // Generate a random fact
  const generateRandomFact = () => {
    setIsLoading(true)
    
    // Simulate API delay for realism
    setTimeout(() => {
      const availableFacts = selectedCategory === 'All' 
        ? USELESS_FACTS 
        : USELESS_FACTS.filter(fact => fact.category === selectedCategory)
      
      const randomFact = availableFacts[Math.floor(Math.random() * availableFacts.length)]
      const newFact: Fact = {
        id: Date.now().toString(),
        text: randomFact.text,
        source: randomFact.source,
        category: randomFact.category,
        timestamp: new Date()
      }
      
      setCurrentFact(newFact)
      setFacts(prev => [newFact, ...prev.slice(0, 19)]) // Keep last 20 facts
      setFactCount(prev => prev + 1)
      setIsLoading(false)
    }, 500)
  }

  // Initialize with a random fact
  useEffect(() => {
    generateRandomFact()
  }, [])

  const toggleFavorite = (fact: Fact) => {
    const isAlreadyFavorite = favorites.some(fav => fav.id === fact.id)
    
    if (isAlreadyFavorite) {
      setFavorites(prev => prev.filter(fav => fav.id !== fact.id))
    } else {
      setFavorites(prev => [...prev, { ...fact, isFavorite: true }])
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const shareText = currentFact 
    ? `🧠 Useless Fact: ${currentFact.text} \n\nSource: ${currentFact.source} \n\n#UselessFacts #Procrastination`
    : ''

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Random Useless Facts 🧠
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
            <span>Facts Generated: {factCount}</span>
            <span>Favorites: {favorites.length}</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedCategory('All')}
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              size="sm"
            >
              All
            </Button>
            {FACT_CATEGORIES.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Current Fact Display */}
          {currentFact && (
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {currentFact.category}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => toggleFavorite(currentFact)}
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${favorites.some(fav => fav.id === currentFact.id) ? 'text-red-500' : 'text-gray-400'}`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(shareText)}
                      variant="ghost"
                      size="sm"
                      className="p-1"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <p className="text-lg font-medium mb-3 leading-relaxed">
                  {currentFact.text}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Source: {currentFact.source}</span>
                  <span>{currentFact.timestamp.toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Button
              onClick={generateRandomFact}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Loading...' : 'New Fact'}
            </Button>
            
            <Button
              onClick={() => setShowFavorites(!showFavorites)}
              variant="outline"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              {showFavorites ? 'Hide' : 'Show'} Favorites ({favorites.length})
            </Button>
          </div>

          {/* Facts History / Favorites */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {showFavorites ? 'Your Favorite Facts' : 'Recent Facts'}
            </h4>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {(showFavorites ? favorites : facts).map((fact) => (
                  <Card key={fact.id} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{fact.text}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">{fact.category}</span>
                          <span>{fact.source}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => toggleFavorite(fact)}
                        variant="ghost"
                        size="sm"
                        className={`p-1 ml-2 ${favorites.some(fav => fav.id === fact.id) ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        <Bookmark className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {(showFavorites ? favorites : facts).length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    {showFavorites ? 'No favorite facts yet!' : 'No facts generated yet!'}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Fun Stats */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>🎯 Perfect for procrastination! Each fact wastes about 30 seconds.</p>
            <p>💡 You've wasted approximately {Math.round(factCount * 0.5)} minutes learning useless things!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
