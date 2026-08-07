import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PrepositionFill({ questions, onComplete }) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('learn') // 'learn' → 'quiz'
  const [selected, setSelected] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)

  const q = questions[index]
  const isLast = index >= questions.length - 1

  const handleStartQuiz = () => {
    setPhase('quiz')
    setSelected(null)
    setShowAnswer(false)
  }

  const handleSelect = (option) => {
    if (showAnswer) return
    setSelected(option)
    setShowAnswer(true)
    const correct = Array.isArray(q.answers) ? q.answers[0] : q.answer
    if (option === correct) setScore(s => s + 1)
  }

  const handleNext = () => {
    setSelected(null)
    setShowAnswer(false)
    if (isLast) {
      onComplete({ score, total: questions.length })
    } else {
      setIndex(i => i + 1)
      setPhase('learn')
    }
  }

  if (!q) {
    return (
      <div className="card text-center py-16">
        <div className="text-4xl mb-3">🎉</div>
        <p className="text-lg font-semibold text-slate-200">介词练习完成！</p>
        <p className="text-slate-400 mt-2">
          正确 {score} / {questions.length}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          {score >= questions.length * 0.8 ? '🌟 太棒了，介词掌握得很好！' :
           score >= questions.length * 0.5 ? '👍 不错，继续加油！' :
           '💪 基础还需要巩固，多复习规则'}
        </p>
        <button onClick={() => onComplete({ score, total: questions.length })} className="btn-primary mt-4">
          完成
        </button>
      </div>
    )
  }

  const correctAnswer = Array.isArray(q.answers) ? q.answers[0] : q.answer
  const sentenceParts = q.sentence.split('___')

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{index + 1} / {questions.length}</span>
        <span className="text-amber-400 font-medium">
          {phase === 'learn' ? '📖 学习规则' : `正确: ${score}`}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'learn' ? (
          /* ===== LEARNING PHASE ===== */
          <motion.div
            key={`learn-${q.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="card bg-amber-500/5 border-amber-500/20 space-y-4">
              <div>
                <p className="text-xs text-amber-400 font-medium mb-1">📖 介词规则</p>
                <h3 className="text-lg font-bold text-slate-100">{q.ruleTitle}</h3>
              </div>

              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-sm text-slate-300 leading-relaxed">{q.rule}</p>
              </div>

              <div className="bg-amber-500/10 rounded-xl p-4">
                <p className="text-xs text-amber-400 mb-1">例句</p>
                <p className="text-slate-200">
                  {sentenceParts.map((part, i) => (
                    <span key={i}>
                      {part}
                      {i < sentenceParts.length - 1 && (
                        <span className="text-amber-400 font-bold underline decoration-amber-400/50">
                          {correctAnswer}
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              </div>

              <button onClick={handleStartQuiz} className="btn-primary w-full">
                明白了，开始做题 ✍️
              </button>
            </div>
          </motion.div>
        ) : (
          /* ===== QUIZ PHASE ===== */
          <motion.div
            key={`quiz-${q.id}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Sentence with blank */}
            <div className="card">
              <p className="text-xs text-amber-400 font-medium mb-2">{q.ruleTitle}</p>
              <p className="text-lg leading-relaxed">
                {sentenceParts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < sentenceParts.length - 1 && (
                      <span className={`inline-block mx-1 px-2 py-0.5 rounded border-2 min-w-[40px] text-center font-bold ${
                        showAnswer
                          ? selected === correctAnswer
                            ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                            : 'border-rose-500 text-rose-400 bg-rose-500/10'
                          : 'border-slate-600 text-slate-400 bg-slate-800'
                      }`}>
                        {showAnswer ? (selected === correctAnswer ? correctAnswer : selected || '?') : '?'}
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>

            {/* Options or Result */}
            {!showAnswer ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className="card text-center py-4 font-semibold text-lg hover:border-amber-500/50 transition-all active:scale-95 cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card space-y-3 mt-4"
              >
                <div className="flex items-center gap-2">
                  {selected === correctAnswer ? (
                    <span className="text-emerald-400 text-lg">✅ 正确！</span>
                  ) : (
                    <span className="text-rose-400 text-lg">
                      ❌ 正确答案是 <strong className="text-amber-400">{correctAnswer}</strong>
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">💡 {q.explanation}</p>
                <button onClick={handleNext} className="btn-primary w-full">
                  {isLast ? '完成练习' : '下一题 →'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
