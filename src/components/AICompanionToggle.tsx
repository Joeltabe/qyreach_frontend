import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Sparkles } from 'lucide-react'
import AICompanion from './AICompanion'

const AICompanionToggle = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-40 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        whileHover={{ scale: isOpen ? 0 : 1.1 }}
        whileTap={{ scale: isOpen ? 0 : 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Bot className="w-6 h-6" />
        </motion.div>
        
        {/* Sparkle animation */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ 
            scale: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </motion.div>
        
        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{ 
            scale: [1, 1.5, 2],
            opacity: [0.6, 0.3, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/20"
          animate={{ 
            scale: [1, 1.8, 2.5],
            opacity: [0.4, 0.2, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.3
          }}
        />
      </motion.button>

      {/* AI Companion */}
      <AnimatePresence>
        {isOpen && (
          <AICompanion isOpen={isOpen} onToggle={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default AICompanionToggle
