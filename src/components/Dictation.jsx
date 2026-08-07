import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speakWord } from '../utils/speech'

export default function Dictation({ words, onComplete }) {
  const [index, setIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [playing, setPlaying] = useState(false)

  const currentWord = words[index]
  const isLast = index >= words.length - 1

  const handlePlay = useCallback(async () => {
    if (!currentWord || playing) return
    setPlaying(true)
    await speakWord(currentWord.word, 0.85)
    setPlaying(false)
  }, [currentWord, playing])

  const handleSubmit = () => {
    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase()
    if (correct) setScore(s => s + 1)
    setShowAnswer(true)
  }

  const handleNext = () => {
    setUserInput('')
    setShowAnswer(false)
    if (isLast) {
      onComplete({ score, total: words.length })
    } else {
      setIndex(i => i + 1)
    }
  }

  if (!currentWord) {
    return (
      <div className="card text-center py-16">
        <p className="text-slate-400">听写完成！</p>
        <button onClick={() => onComplete({ score, total: words.length })} className="btn-primary mt-4">
          查看成绩
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{index + 1} / {words.length}</span>
        <span className="text-rose-400 font-medium">正确: {score}</span>
      </div>

      {/* Play button */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="card text-center py-12"
        >
          <button
            onClick={handlePlay}
            disabled={playing}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${
              playing
                ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:scale-90'
            }`}
          >
            {playing ? '⏳' : '🔊'}
          </button>
          <p className="text-slate-500 text-sm mt-3">
            点击播放，听写单词（可重复播放）
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Input */}
      <div>
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (showAnswer) handleNext()
              else handleSubmit()
            }
          }}
          placeholder="输入你听到的单词..."
          className="input-field text-center text-lg"
          autoFocus
          disabled={showAnswer}
        />
        {!showAnswer && (
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim()}
            className="btn-primary w-full mt-3"
          >
            确认
          </button>
        )}
      </div>

      {/* Answer reveal */}
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card space-y-3"
        >
          {userInput.trim().toLowerCase() === currentWord.word.toLowerCase() ? (
            <p className="text-emerald-400 text-lg">✅ 正确！</p>
          ) : (
            <div>
              <p className="text-rose-400 text-lg">❌ 你写的是：{userInput}</p>
              <p className="text-amber-400 text-lg mt-1">
                正确答案：<strong>{currentWord.word}</strong>
                <span className="text-slate-400 text-sm ml-2">{currentWord.phonetic}</span>
              </p>
            </div>
          )}
          <p className="text-sm text-slate-400">{currentWord.meaning}</p>
          <button onClick={handleNext} className="btn-primary w-full">
            {isLast ? '完成练习' : '下一题 →'}
          </button>
        </motion.div>
      )}
    </div>
  )
}
