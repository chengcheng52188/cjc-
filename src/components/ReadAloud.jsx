import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { startListening, compareSpeech, speakSentence } from '../utils/speech'

export default function ReadAloud({ sentences, onComplete }) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('demo') // 'demo' → 'listen' → 'result'
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const currentSentence = sentences[index]
  const isLast = index >= sentences.length - 1

  // Auto-play demo when entering demo phase
  useEffect(() => {
    if (currentSentence && currentSentence.english) {
      speakSentence(currentSentence.english, 0.8)
    }
  }, [currentSentence, index])

  const handleReplay = () => {
    if (currentSentence?.english) {
      speakSentence(currentSentence.english, 0.8)
    }
  }

  const handleStartListening = async () => {
    setPhase('listen')
    setListening(true)
    setError(null)
    setResult(null)
    try {
      const transcript = await startListening()
      if (currentSentence?.english) {
        const comparison = compareSpeech(currentSentence.english, transcript)
        setResult(comparison)
      }
      setPhase('result')
    } catch (err) {
      setError(err.message)
      setPhase('demo')
    }
    setListening(false)
  }

  const handleNext = () => {
    setResult(null)
    setError(null)
    if (isLast) {
      onComplete()
    } else {
      setIndex(i => i + 1)
      setPhase('demo')
    }
  }

  const handleSkip = () => {
    setError(null)
    setResult(null)
    if (isLast) {
      onComplete()
    } else {
      setIndex(i => i + 1)
      setPhase('demo')
    }
  }

  if (!currentSentence || !currentSentence.english) {
    return (
      <div className="card text-center py-16">
        <p className="text-slate-400">跟读练习完成！</p>
        <button onClick={onComplete} className="btn-primary mt-4">完成</button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span>{index + 1} / {sentences.length}</span>
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all"
            style={{ width: `${((index + 1) / sentences.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentSentence.id}-${phase}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {/* Demo Phase: Show English + Play */}
          {phase === 'demo' && (
            <div className="card text-center py-8 bg-cyan-500/5 border-cyan-500/20 space-y-4">
              <p className="text-xs text-cyan-400 font-medium">🎧 请听示范发音</p>

              {/* English sentence */}
              <div className="bg-slate-900 rounded-xl p-5">
                <p className="text-xl font-semibold text-slate-100 leading-relaxed">
                  {currentSentence.english}
                </p>
              </div>

              {/* Chinese reference */}
              <p className="text-sm text-slate-500">{currentSentence.chinese}</p>

              <div className="flex gap-3 justify-center">
                <button onClick={handleReplay} className="btn-secondary text-sm">
                  🔊 再听一遍
                </button>
                <button onClick={handleStartListening} className="btn-primary text-sm">
                  🎤 我来跟读
                </button>
              </div>
            </div>
          )}

          {/* Listening Phase */}
          {phase === 'listen' && (
            <div className="card text-center py-12 bg-cyan-500/5 border-cyan-500/20">
              <button
                disabled={listening}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all ${
                  listening
                    ? 'bg-cyan-500/20 text-cyan-400 animate-pulse scale-110'
                    : 'bg-cyan-500/10 text-cyan-400'
                }`}
              >
                🎙️
              </button>
              <p className="text-cyan-400 mt-4 font-medium">正在聆听，请朗读上面的句子...</p>
            </div>
          )}

          {/* Result Phase */}
          {phase === 'result' && result && (
            <div className="card space-y-4">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-2">发音准确率</p>
                <span className={`text-3xl font-bold ${
                  result.accuracy >= 80 ? 'text-emerald-400' :
                  result.accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {result.accuracy}%
                </span>
              </div>

              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">原文</p>
                <p className="text-slate-300 text-sm">{currentSentence.english}</p>
              </div>

              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">你的发音</p>
                <p className="text-slate-200 text-sm">{result.transcript}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.words.map((w, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded text-sm ${
                      w.match
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400 line-through'
                    }`}
                  >
                    {w.word}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handleReplay} className="btn-secondary flex-1 text-sm">
                  🔊 再听示范
                </button>
                <button onClick={handleNext} className="btn-primary flex-1">
                  {isLast ? '完成练习' : '下一句 →'}
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="card text-center">
              <p className="text-rose-400 mb-3">{error}</p>
              <p className="text-slate-500 text-sm mb-4">
                请在 Chrome 浏览器中使用此功能，并允许麦克风权限
              </p>
              <button onClick={handleSkip} className="btn-secondary">
                跳过此题
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
