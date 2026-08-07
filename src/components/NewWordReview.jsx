import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speakWord } from '../utils/speech'

export default function NewWordReview({ words, onComplete }) {
  const [index, setIndex] = useState(0)
  const [unknownIds, setUnknownIds] = useState([])
  const [showMeaning, setShowMeaning] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(null)

  const currentWord = words[index]

  // Auto-advance after 3 seconds in quick review mode
  useCallback(() => {
    if (autoAdvance) clearTimeout(autoAdvance)
    const timer = setTimeout(() => {
      if (index < words.length - 1) {
        setShowMeaning(false)
        setIndex(i => i + 1)
      }
    }, 3000)
    setAutoAdvance(timer)
    return () => clearTimeout(timer)
  }, [index])

  const handleKnow = () => {
    setShowMeaning(false)
    if (index >= words.length - 1) {
      onComplete({ unknownCount: unknownIds.length, total: words.length })
    } else {
      setIndex(i => i + 1)
    }
  }

  const handleUnknown = () => {
    if (!unknownIds.includes(currentWord.id)) {
      setUnknownIds([...unknownIds, currentWord.id])
    }
    setShowMeaning(false)
    if (index >= words.length - 1) {
      onComplete({ unknownCount: unknownIds.length + 1, total: words.length })
    } else {
      setIndex(i => i + 1)
    }
  }

  if (!currentWord) {
    return (
      <div className="card text-center py-16">
        <div className="text-4xl mb-3">🎉</div>
        <p className="text-slate-200 font-semibold">新词复习完成！</p>
        <p className="text-slate-400 text-sm mt-2">
          不认识 {unknownIds.length} / {words.length} 个词
        </p>
        <button onClick={() => onComplete({ unknownCount: unknownIds.length, total: words.length })} className="btn-primary mt-4">
          完成
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{index + 1} / {words.length}</span>
        <span className="text-indigo-400 text-xs">快速复习 · 每个3秒</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card text-center py-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h2 className="text-3xl font-bold text-slate-100">{currentWord.word}</h2>
              <button
                onClick={() => speakWord(currentWord.word)}
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
              >
                🔊
              </button>
            </div>
            <p className="text-slate-400 text-sm">{currentWord.phonetic}</p>

            {showMeaning && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <p className="text-indigo-400 font-semibold text-lg">{currentWord.meaning}</p>
                <p className="text-slate-400 text-sm mt-2 italic">"{currentWord.example}"</p>
              </motion.div>
            )}

            {!showMeaning && (
              <button
                onClick={() => setShowMeaning(true)}
                className="btn-ghost mt-4 text-sm"
              >
                显示释义
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handleUnknown} className="btn-secondary flex-1">
          😕 不认识
        </button>
        <button onClick={handleKnow} className="btn-primary flex-1">
          ✅ 认识了
        </button>
      </div>
    </div>
  )
}
