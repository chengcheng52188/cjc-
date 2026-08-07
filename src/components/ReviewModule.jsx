import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speakWord } from '../utils/speech'
import { scheduleWordReview } from '../utils/spaced-repetition'

export default function ReviewModule({ words, onComplete }) {
  const [index, setIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const currentWord = words[index]
  const isLast = index >= words.length - 1

  const handleSubmit = () => {
    if (!userInput.trim() || submitted || !currentWord) return
    setSubmitted(true)
    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase()
    if (correct) { setScore(s => s + 1); scheduleWordReview(currentWord.id, 5) }
    else { scheduleWordReview(currentWord.id, 1) }
  }

  const handleNext = () => {
    setUserInput(''); setSubmitted(false); setShowHint(false)
    if (isLast) onComplete({ score, total: words.length })
    else setIndex(i => i + 1)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (submitted) handleNext()
      else handleSubmit()
    }
  }

  if (!currentWord) {
    return (
      <div className="text-center py-20 fade-in">
        <div className="text-5xl mb-6">🔄</div>
        <p className="text-sm mb-6" style={{color: '#5c5c78'}}>今天没有需要复习的单词</p>
        <button onClick={() => onComplete({ score: 0, total: 0 })} className="btn btn-primary">完成</button>
      </div>
    )
  }

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      {/* Progress dots + score */}
      <div className="flex items-center justify-between text-xs" style={{color: '#5c5c78'}}>
        <div className="flex gap-1.5">
          {Array.from({length: Math.min(words.length, 8)}).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{background: i < index ? '#8be0a0' : i === index ? '#8be0a0' : 'rgba(255,255,255,0.06)'}} />
          ))}
        </div>
        <span>{index + 1}/{words.length} · 复习</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentWord.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
          {/* Prompt */}
          <div className="text-center py-14 rounded-2xl"
            style={{background: 'rgba(139,224,160,0.06)', border: '1px solid rgba(139,224,160,0.1)'}}>
            <p className="text-xs mb-4 tracking-widest uppercase" style={{color: '#8be0a0'}}>请拼写</p>
            <p className="text-2xl font-medium mb-3" style={{color: '#d0d0e0'}}>{currentWord.meaning}</p>

            <div className="flex items-center justify-center gap-3">
              <button onClick={() => speakWord(currentWord.word)}
                className="text-xs py-1.5 px-4 rounded-lg transition-all"
                style={{color: '#8be0a0', background: 'rgba(139,224,160,0.1)'}}>
                🔊 听发音
              </button>
              <button onClick={() => setShowHint(!showHint)}
                className="text-xs py-1.5 px-4 rounded-lg transition-all"
                style={{color: '#5c5c78', background: 'rgba(255,255,255,0.04)'}}>
                💡 {showHint ? currentWord.word.charAt(0) + '...' : '提示'}
              </button>
            </div>
          </div>

          {!submitted ? (
            <div className="mt-5">
              <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)}
                placeholder="输入英文拼写..."
                className="input-field text-center text-xl tracking-wider"
                autoFocus autoComplete="off" spellCheck="false"
                style={{fontFamily: 'SF Mono, monospace'}} />
              <button onClick={handleSubmit} disabled={!userInput.trim()}
                className="btn btn-primary w-full mt-3">确认</button>
            </div>
          ) : (
            <div className="mt-5 py-8 text-center rounded-2xl"
              style={{background: userInput.trim().toLowerCase() === currentWord.word.toLowerCase()
                ? 'rgba(139,224,160,0.06)' : 'rgba(255,120,120,0.06)',
                border: `1px solid ${userInput.trim().toLowerCase() === currentWord.word.toLowerCase()
                ? 'rgba(139,224,160,0.15)' : 'rgba(255,120,120,0.15)'}`}}>
              {userInput.trim().toLowerCase() === currentWord.word.toLowerCase() ? (
                <div>
                  <div className="text-4xl mb-2">✓</div>
                  <p className="text-xl font-medium" style={{color: '#8be0a0'}}>{currentWord.word}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm line-through mb-2" style={{color: '#ff7878'}}>{userInput}</p>
                  <p className="text-2xl font-medium" style={{color: '#ffe08a'}}>{currentWord.word}</p>
                  <p className="text-sm mt-2" style={{color: '#5c5c78'}}>{currentWord.meaning}</p>
                </div>
              )}
              <button onClick={handleNext} className="btn btn-primary mt-6">
                {isLast ? '完成' : '下一词 →'}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
