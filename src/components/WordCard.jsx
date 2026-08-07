import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speakWord } from '../utils/speech'
import { markWordLearned } from '../utils/spaced-repetition'

export default function NewWordsModule({ words, onComplete }) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('learn')
  const [userInput, setUserInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const currentWord = words[index]
  const isLast = index >= words.length - 1

  useCallback(() => {
    if (currentWord && phase === 'learn') speakWord(currentWord.word)
  }, [currentWord, phase])

  const handleSubmit = () => {
    if (!userInput.trim() || submitted) return
    setSubmitted(true)
    if (userInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      setScore(s => s + 1); markWordLearned(currentWord.id)
    }
  }

  const handleNext = () => {
    setUserInput(''); setSubmitted(false)
    if (isLast) onComplete({ score, total: words.length })
    else { setIndex(i => i + 1); setPhase('learn') }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (phase === 'learn') { setPhase('spell'); setUserInput(''); setSubmitted(false) }
      else if (submitted) handleNext()
      else handleSubmit()
    }
  }

  if (!currentWord) {
    return (
      <div className="text-center py-20 fade-in">
        <div className="text-5xl mb-6">✦</div>
        <div className="text-2xl font-light mb-1" style={{color: '#9b9bff'}}>{score}/{words.length}</div>
        <p className="text-sm mb-8" style={{color: '#5c5c78'}}>拼写正确</p>
        <button onClick={() => onComplete({ score, total: words.length })} className="btn btn-primary">完成</button>
      </div>
    )
  }

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between text-xs" style={{color: '#5c5c78'}}>
        <div className="flex gap-1.5">
          {Array.from({length: Math.min(words.length, 8)}).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{background: i < index ? '#9b9bff' : i === index ? '#9b9bff' : 'rgba(255,255,255,0.06)'}} />
          ))}
        </div>
        <span>{index + 1}/{words.length} · {score}✓</span>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'learn' ? (
          <motion.div key={`l-${currentWord.id}`} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="text-center py-14 rounded-2xl"
            style={{background: 'rgba(155,155,255,0.06)', border: '1px solid rgba(155,155,255,0.1)'}}>
            <p className="text-xs tracking-widest uppercase mb-8" style={{color: '#9b9bff'}}>新词学习</p>
            <h2 className="text-5xl font-thin tracking-tight mb-3" style={{color: '#d0d0e0'}}>{currentWord.word}</h2>
            <button onClick={() => speakWord(currentWord.word)}
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-lg mb-8"
              style={{background: 'rgba(155,155,255,0.12)', color: '#9b9bff'}}>🔊</button>
            <p className="text-lg font-medium mb-2" style={{color: '#9b9bff'}}>{currentWord.meaning}</p>
            {currentWord.example && (
              <p className="text-sm italic max-w-xs mx-auto leading-relaxed" style={{color: '#5c5c78'}}>
                "{currentWord.example}"
              </p>
            )}
            <button onClick={() => { setPhase('spell'); setUserInput(''); setSubmitted(false) }}
              className="btn btn-primary mt-10">开始拼写</button>
          </motion.div>
        ) : (
          <motion.div key={`s-${currentWord.id}`} initial={{opacity:0}} animate={{opacity:1}}
            className="text-center py-10 rounded-2xl"
            style={{background: 'rgba(155,155,255,0.04)', border: '1px solid rgba(155,155,255,0.08)'}}>
            <p className="text-xs tracking-widest uppercase mb-6" style={{color: '#9b9bff'}}>请拼写</p>
            <p className="text-2xl font-medium mb-4" style={{color: '#d0d0e0'}}>{currentWord.meaning}</p>
            <button onClick={() => speakWord(currentWord.word)} className="text-xs mb-8" style={{color: '#5c5c78'}}>🔊 听发音</button>

            {!submitted ? (
              <div>
                <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)}
                  placeholder="输入英文..." className="input-field text-center text-xl tracking-wider"
                  autoFocus autoComplete="off" spellCheck="false"
                  style={{fontFamily: 'SF Mono, monospace'}} />
                <button onClick={handleSubmit} disabled={!userInput.trim()}
                  className="btn btn-primary w-full mt-4">确认</button>
              </div>
            ) : (
              <div className="py-6">
                {userInput.trim().toLowerCase() === currentWord.word.toLowerCase() ? (
                  <div><div className="text-4xl mb-2">✓</div><p className="text-xl font-medium" style={{color:'#8be0a0'}}>{currentWord.word}</p></div>
                ) : (
                  <div>
                    <p className="text-sm line-through mb-2" style={{color:'#ff7878'}}>{userInput}</p>
                    <p className="text-2xl font-medium" style={{color:'#ffe08a'}}>{currentWord.word}</p>
                    <p className="text-sm mt-2" style={{color:'#5c5c78'}}>{currentWord.meaning}</p>
                  </div>
                )}
                <button onClick={handleNext} className="btn btn-primary mt-8">{isLast ? '完成' : '下一词 →'}</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
