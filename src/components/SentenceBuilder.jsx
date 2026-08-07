import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gradeSentence } from '../utils/deepseek'

export default function SentenceBuilder({ prompts, learnedWords, onComplete }) {
  const [index, setIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const currentPrompt = prompts[index]
  const isLast = index >= prompts.length - 1

  const handleSubmit = useCallback(async () => {
    if (!userInput.trim() || loading) return
    setLoading(true)
    try {
      const result = await gradeSentence(currentPrompt.chinese, userInput)
      setFeedback(result)
      setHistory(h => [...h, { prompt: currentPrompt.chinese, input: userInput, result }])
    } catch {
      setFeedback({ error: '评分失败，请重试', score: 0 })
    }
    setLoading(false)
  }, [userInput, currentPrompt, loading])

  const handleNext = () => {
    setUserInput('')
    setFeedback(null)
    if (isLast) {
      onComplete(history)
    } else {
      setIndex(i => i + 1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (feedback) handleNext()
      else handleSubmit()
    }
  }

  if (!currentPrompt) {
    return (
      <div className="card text-center py-16">
        <p className="text-slate-400">造句练习完成！</p>
        <button onClick={() => onComplete(history)} className="btn-primary mt-4">查看总结</button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span>{index + 1} / {prompts.length}</span>
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${((index + 1) / prompts.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Prompt */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPrompt.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="card bg-purple-500/5 border-purple-500/20">
            <p className="text-xs text-purple-400 font-medium mb-2">请翻译成英文</p>
            <p className="text-lg font-semibold text-slate-100">{currentPrompt.chinese}</p>
            {currentPrompt.hint && (
              <p className="text-xs text-slate-500 mt-2">提示词：{currentPrompt.hint}</p>
            )}
          </div>

          {/* Learned words hint */}
          {learnedWords && learnedWords.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-1.5">💡 试试用你学过的词：</p>
              <div className="flex flex-wrap gap-1.5">
                {learnedWords.slice(0, 15).map(w => (
                  <span key={w} className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Input */}
      {!feedback && (
        <div>
          <textarea
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的英文翻译..."
            className="input-field min-h-[100px] resize-none"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim() || loading}
            className="btn-primary w-full mt-3"
          >
            {loading ? '评分中...' : '提交评分'}
          </button>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">AI 评分</span>
            <span className={`text-2xl font-bold ${
              feedback.score >= 8 ? 'text-emerald-400' :
              feedback.score >= 5 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {feedback.score}/10
            </span>
          </div>

          {feedback.error ? (
            <p className="text-rose-400 text-sm">{feedback.error}</p>
          ) : (
            <>
              {feedback.grammar && (
                <div className="text-sm">
                  <span className="text-slate-400">语法：</span>
                  <span className="text-slate-200">{feedback.grammar}</span>
                </div>
              )}
              {feedback.preposition && (
                <div className="text-sm">
                  <span className="text-slate-400">介词：</span>
                  <span className="text-slate-200">{feedback.preposition}</span>
                </div>
              )}
              {feedback.tense && (
                <div className="text-sm">
                  <span className="text-slate-400">时态：</span>
                  <span className="text-slate-200">{feedback.tense}</span>
                </div>
              )}
              {feedback.correction && feedback.correction !== userInput && (
                <div className="bg-slate-900 rounded-lg p-3 text-sm">
                  <span className="text-emerald-400">正确写法：</span>
                  <span className="text-slate-200 ml-1">{feedback.correction}</span>
                </div>
              )}
              {feedback.suggestion && (
                <div className="text-sm text-slate-400 italic">💡 {feedback.suggestion}</div>
              )}
            </>
          )}

          <button onClick={handleNext} className="btn-primary w-full">
            {isLast ? '完成练习' : '下一题 →'}
          </button>
        </motion.div>
      )}
    </div>
  )
}
