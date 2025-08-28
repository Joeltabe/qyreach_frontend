import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Sparkles, Zap, Brain } from 'lucide-react'
import AICompanion from './AICompanion'

const AICompanionToggle = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  const [showHint, setShowHint] = useState(false)
  const [hintText, setHintText] = useState('')

  // Smart hints that appear periodically
  const hints = [
    "💡 Ask me anything about Qyreach!",
    "🚀 I can help you create campaigns",
    "📊 Want to see your analytics?", 
    "🎯 Need help with targeting?",
    "⚡ Try our AI email composer!",
    "🎨 Browse our template library",
    "👥 Manage your contact lists"
  ]

  useEffect(() => {
    // Show hints every 15 seconds when not open
    if (!isOpen) {
      const hintInterval = setInterval(() => {
        if (!showHint) {
          const randomHint = hints[Math.floor(Math.random() * hints.length)]
          setHintText(randomHint)
          setShowHint(true)
          
          // Hide hint after 4 seconds
          setTimeout(() => setShowHint(false), 4000)
        }
      }, 15000)

      return () => clearInterval(hintInterval)
    }
  }, [isOpen, showHint])

  // Disable pulse after first interaction
  useEffect(() => {
    if (isOpen) {
      setShowPulse(false)
      setShowHint(false)
    }
  }, [isOpen])

  const sparkleVariants = {
    initial: { scale: 0, opacity: 0, rotate: 0 },
    animate: { 
      scale: [0, 1, 0], 
      opacity: [0, 1, 0], 
      rotate: [0, 180, 360],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  }

  return (
    <>
      {/* AI Companion Component */}
      <AICompanion isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* Enhanced Toggle Button Container */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Smart Hint Tooltip */}
        <AnimatePresence>
          {showHint && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="absolute bottom-16 right-0 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-medium whitespace-nowrap max-w-xs"
            >
              <div className="relative">
                {hintText}
                <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-600"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
          animate={{
            boxShadow: showPulse ? [
              '0 0 0 0 rgba(59, 130, 246, 0.7)',
              '0 0 0 10px rgba(59, 130, 246, 0)',
              '0 0 0 20px rgba(59, 130, 246, 0)'
            ] : '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: showPulse ? Infinity : 0,
              ease: "easeOut"
            }
          }}
        >
          {/* Floating Sparkles */}
          {!isOpen && (
            <>
              <motion.div
                className="absolute -top-1 -right-1 text-yellow-300"
                variants={sparkleVariants}
                initial="initial"
                animate="animate"
              >
                <Sparkles size={12} />
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-1 text-yellow-300"
                variants={sparkleVariants}
                initial="initial"
                animate="animate"
                style={{ animationDelay: '0.5s' }}
              >
                <Zap size={10} />
              </motion.div>
              <motion.div
                className="absolute top-0 left-0 text-yellow-300"
                variants={sparkleVariants}
                initial="initial"
                animate="animate"
                style={{ animationDelay: '1s' }}
              >
                <Brain size={8} />
              </motion.div>
            </>
          )}

          {/* Main Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <MessageCircle size={24} className="text-white" />
            )}
          </motion.div>

          {/* Notification Badge */}
          {!isOpen && showPulse && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          )}
        </motion.button>

        {/* AI Status Indicator */}
        {!isOpen && (
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span>AI Online</span>
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}

export default AICompanionToggle
