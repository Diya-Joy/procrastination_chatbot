'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, GraduationCap, Briefcase, Home, RefreshCw, Copy, Check } from 'lucide-react'

interface ThemedModesProps {
  onClose: () => void
}

type ModeType = 'menu' | 'student' | 'office' | 'parent'

interface Excuse {
  id: string
  text: string
  category: string
  creativity: number // 1-5 stars
  believability: number // 1-5 stars
}

const STUDENT_EXCUSES = [
  { text: "I need to research the optimal study environment first. This could take weeks of testing different lighting conditions.", category: "Research", creativity: 4, believability: 3 },
  { text: "My brain works better under pressure, so I'm strategically waiting until the last minute for peak performance.", category: "Strategy", creativity: 3, believability: 4 },
  { text: "I'm letting the assignment marinate in my subconscious. Einstein did his best thinking while procrastinating.", category: "Psychology", creativity: 5, believability: 2 },
  { text: "I need to organize my desk first. A cluttered space equals a cluttered mind, and this homework deserves my best.", category: "Organization", creativity: 2, believability: 5 },
  { text: "I'm waiting for the perfect moment when Mercury isn't in retrograde. Cosmic energy affects academic performance.", category: "Astrology", creativity: 5, believability: 1 },
  { text: "I should probably eat something first. Low blood sugar could affect my cognitive abilities and homework quality.", category: "Health", creativity: 2, believability: 4 },
  { text: "I need to check if there are any updates to the assignment. Better refresh the portal 47 more times to be sure.", category: "Diligence", creativity: 3, believability: 3 },
  { text: "My laptop battery is at 47%. I should wait until it's fully charged for optimal performance and to avoid interruptions.", category: "Technical", creativity: 2, believability: 4 },
  { text: "I'm conducting an experiment on the correlation between procrastination and creativity. This delay is for science!", category: "Science", creativity: 5, believability: 2 },
  { text: "I need to create the perfect study playlist first. Music selection is crucial for academic success.", category: "Preparation", creativity: 3, believability: 3 }
]

const OFFICE_EXCUSES = [
  { text: "I'm strategically waiting for the afternoon energy dip to pass. Peak productivity happens after 3 PM anyway.", category: "Productivity", creativity: 3, believability: 4 },
  { text: "I need to clear my inbox first. Can't focus on important work with 247 unread emails lurking in the background.", category: "Organization", creativity: 2, believability: 5 },
  { text: "I'm waiting for the office to quiet down. Open offices are productivity killers, and I need optimal focus for this task.", category: "Environment", creativity: 3, believability: 4 },
  { text: "I should probably grab another coffee first. Caffeine levels directly correlate with work quality and efficiency.", category: "Performance", creativity: 2, believability: 4 },
  { text: "I'm letting this project percolate in my mind. The best solutions come when you're not actively thinking about them.", category: "Strategy", creativity: 4, believability: 3 },
  { text: "I need to update my project management software first. Proper tracking is essential for successful task completion.", category: "Management", creativity: 2, believability: 4 },
  { text: "I'm waiting for my colleague to finish their part. No point starting until I have all the dependencies resolved.", category: "Dependencies", creativity: 3, believability: 5 },
  { text: "I should research industry best practices first. This task deserves a thoroughly researched approach.", category: "Research", creativity: 3, believability: 3 },
  { text: "My desk ergonomics aren't optimal right now. Poor posture could lead to decreased productivity and potential injury.", category: "Health", creativity: 3, believability: 3 },
  { text: "I'm practicing mindful procrastination. Sometimes the best action is strategic inaction until clarity emerges.", category: "Mindfulness", creativity: 5, believability: 2 }
]

const PARENT_EXCUSES = [
  { text: "I'm teaching the kids independence by letting them figure things out themselves. This mess is a learning opportunity!", category: "Parenting", creativity: 4, believability: 3 },
  { text: "I need to finish this episode first. It's educational content about organization, so it's basically research for better chore management.", category: "Education", creativity: 3, believability: 2 },
  { text: "I'm waiting for the kids to nap/leave/be distracted. Cleaning while they're awake is like brushing your teeth while eating cookies.", category: "Timing", creativity: 4, believability: 5 },
  { text: "I should probably eat something first. Parenting requires energy, and I can't tackle chores on an empty stomach.", category: "Self-care", creativity: 2, believability: 4 },
  { text: "I'm letting the dishes 'soak' for optimal cleaning efficiency. Some stains need time to loosen up properly.", category: "Efficiency", creativity: 3, believability: 4 },
  { text: "I need to make a proper cleaning schedule first. Random chore-doing is inefficient compared to systematic approaches.", category: "Planning", creativity: 3, believability: 3 },
  { text: "I'm waiting for the right mood. Cleaning with resentment creates negative energy in the home environment.", category: "Wellness", creativity: 4, believability: 2 },
  { text: "I should probably sort through things first to decide what actually needs cleaning. Marie Kondo would approve of this delay.", category: "Organization", creativity: 3, believability: 3 },
  { text: "I'm conserving my energy for when the kids really need me. Parental burnout is real, and self-preservation is important.", category: "Mental Health", creativity: 4, believability: 4 },
  { text: "I need to find the right cleaning supplies first. Using the wrong products could damage surfaces or be ineffective.", category: "Preparation", creativity: 2, believability: 4 }
]

export default function ThemedModes({ onClose }: ThemedModesProps) {
  const [currentMode, setCurrentMode] = useState<ModeType>('menu')
  const [currentExcuse, setCurrentExcuse] = useState<Excuse | null>(null)
  const [excuseCount, setExcuseCount] = useState({ student: 0, office: 0, parent: 0 })
  const [copied, setCopied] = useState(false)

  const getExcusesForMode = (mode: ModeType): Excuse[] => {
    switch (mode) {
      case 'student': return STUDENT_EXCUSES.map((excuse, index) => ({ ...excuse, id: `student-${index}` }))
      case 'office': return OFFICE_EXCUSES.map((excuse, index) => ({ ...excuse, id: `office-${index}` }))
      case 'parent': return PARENT_EXCUSES.map((excuse, index) => ({ ...excuse, id: `parent-${index}` }))
      default: return []
    }
  }

  const generateExcuse = (mode: ModeType) => {
    const excuses = getExcusesForMode(mode)
    const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)]
    setCurrentExcuse(randomExcuse)
    setExcuseCount(prev => ({ ...prev, [mode]: prev[mode as keyof typeof prev] + 1 }))
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

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getModeIcon = (mode: ModeType) => {
    switch (mode) {
      case 'student': return <GraduationCap className="w-6 h-6" />
      case 'office': return <Briefcase className="w-6 h-6" />
      case 'parent': return <Home className="w-6 h-6" />
      default: return null
    }
  }

  const getModeColor = (mode: ModeType) => {
    switch (mode) {
      case 'student': return 'from-blue-600 to-indigo-600'
      case 'office': return 'from-gray-600 to-slate-600'
      case 'parent': return 'from-green-600 to-emerald-600'
      default: return 'from-purple-600 to-pink-600'
    }
  }

  const renderMenu = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose Your Procrastination Style 🎭</h3>
        <p className="text-sm text-gray-600 mb-4">Get personalized excuses for your specific situation!</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-300 hover:scale-105"
          onClick={() => setCurrentMode('student')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎓</div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-700">Student Mode</h4>
                <p className="text-xs text-gray-600">Creative excuses for skipping homework and assignments</p>
                <div className="text-xs text-blue-600 mt-1">Excuses generated: {excuseCount.student}</div>
              </div>
              <GraduationCap className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-gray-300 hover:scale-105"
          onClick={() => setCurrentMode('office')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💼</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-700">Office Mode</h4>
                <p className="text-xs text-gray-600">Professional excuses for avoiding office work</p>
                <div className="text-xs text-gray-600 mt-1">Excuses generated: {excuseCount.office}</div>
              </div>
              <Briefcase className="w-6 h-6 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-300 hover:scale-105"
          onClick={() => setCurrentMode('parent')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏠</div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-700">Parent Mode</h4>
                <p className="text-xs text-gray-600">Relatable excuses for avoiding household chores</p>
                <div className="text-xs text-green-600 mt-1">Excuses generated: {excuseCount.parent}</div>
              </div>
              <Home className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-xs text-gray-500">
        Total excuses generated: {excuseCount.student + excuseCount.office + excuseCount.parent} 🏆
      </div>
    </div>
  )

  const renderModeContent = (mode: ModeType) => {
    const modeNames = { student: 'Student', office: 'Office', parent: 'Parent' }
    const modeEmojis = { student: '🎓', office: '💼', parent: '🏠' }
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
            {getModeIcon(mode)}
            {modeNames[mode]} Mode {modeEmojis[mode]}
          </h3>
          <p className="text-sm text-gray-600">Perfect excuses for your situation!</p>
        </div>
        
        {currentExcuse && (
          <Card className={`border-2 bg-gradient-to-br from-gray-50 to-white`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {currentExcuse.category}
                </span>
                <Button
                  onClick={() => copyToClipboard(currentExcuse.text)}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <p className="text-lg font-medium mb-3 leading-relaxed">
                "{currentExcuse.text}"
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div>Creativity: {renderStars(currentExcuse.creativity)}</div>
                  <div>Believability: {renderStars(currentExcuse.believability)}</div>
                </div>
                <div className="text-right text-gray-500">
                  <div>Excuse #{excuseCount[mode as keyof typeof excuseCount]}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => generateExcuse(mode)}
            className={`bg-gradient-to-r ${getModeColor(mode)} hover:opacity-90`}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {currentExcuse ? 'New Excuse' : 'Generate Excuse'}
          </Button>
          
          <Button
            onClick={() => setCurrentMode('menu')}
            variant="outline"
          >
            Back to Modes
          </Button>
        </div>
        
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>💡 Pro tip: The lower the believability, the more creative the excuse!</p>
          <p>🎯 You've generated {excuseCount[mode as keyof typeof excuseCount]} {modeNames[mode].toLowerCase()} excuses so far.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className={`bg-gradient-to-r ${getModeColor(currentMode)} text-white`}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {currentMode === 'menu' ? '🎭' : getModeIcon(currentMode)}
              Themed Procrastination Modes
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
          <ScrollArea className="max-h-[60vh]">
            {currentMode === 'menu' && renderMenu()}
            {currentMode !== 'menu' && renderModeContent(currentMode)}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
