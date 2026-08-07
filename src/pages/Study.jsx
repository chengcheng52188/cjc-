import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTodayPlan } from '../utils/daily-plan'
import { markModuleCompleted, updateStreak, updateStats } from '../utils/storage'
import NewWordsModule from '../components/WordCard'
import ReviewModule from '../components/ReviewModule'
import SentenceBuilder from '../components/SentenceBuilder'
import PrepositionFill from '../components/PrepositionFill'
import Dictation from '../components/Dictation'
import ReadAloud from '../components/ReadAloud'
import NewWordReview from '../components/NewWordReview'
import FuzzyText from '../components/ui/FuzzyText/FuzzyText'

const moduleMeta = {
  'new-words': { title: '新词学习', desc: '学习 20 个 CET-4 核心词汇', emoji: '📝', color: '#9b9bff' },
  'review': { title: '单词复习', desc: '间隔重复，巩固旧词', emoji: '🔄', color: '#8be0a0' },
  'sentence': { title: '造句练习', desc: '中译英，AI 智能评分', emoji: '🤖', color: '#e090d0' },
  'preposition': { title: '介词填空', desc: 'in / on / at / to 专项突破', emoji: '🎯', color: '#ffb464' },
  'dictation': { title: '听写训练', desc: '听发音，拼写单词', emoji: '🎧', color: '#ff7878' },
  'read-aloud': { title: '跟读练习', desc: '朗读句子，语音识别评分', emoji: '🎤', color: '#64c8ff' },
  'new-word-review': { title: '新词巩固', desc: '当日新词快速复习', emoji: '⭐', color: '#ffe08a' }
}

export default function Study({ onComplete, onBack }) {
  const [plan, setPlan] = useState(null)
  const [step, setStep] = useState(-1)

  useEffect(() => { setPlan(getTodayPlan()) }, [])

  const handleStart = (startStep) => setStep(startStep)

  const handleModuleComplete = (result = {}) => {
    if (!plan) return
    markModuleCompleted(plan.modules[step].id)
    updateStreak()
    if (result.score !== undefined) updateStats({ totalSentences: result.total || 0 })
    setStep(s => s + 1)
  }

  if (step === -1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
          <div className="text-6xl">📚</div>
          <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover fontSize="clamp(2.5rem, 8vw, 3.5rem)" fontWeight={300} color="#9b9bff">今日学习</FuzzyText>
          </div>
          <p className="text-sm" style={{color: '#5c5c78'}}>7 个模块 · 约 58 分钟</p>
          <div className="space-y-2 text-left w-full max-w-xs">
            {plan?.modules.map((mod, i) => (
              <div key={mod.id} className="flex items-center gap-3 text-sm py-1.5">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium" style={{background: moduleMeta[mod.id]?.color + '20', color: moduleMeta[mod.id]?.color}}>{i + 1}</span>
                <span style={{color: '#8888a0'}}>{moduleMeta[mod.id]?.title}</span>
                <span className="ml-auto text-xs" style={{color: '#3c3c52'}}>~{mod.estimatedTime}min</span>
              </div>
            ))}
          </div>
          <button onClick={() => handleStart(0)} className="btn btn-primary text-lg px-10">开始学习</button>
          <button onClick={onBack} className="btn-ghost text-sm">返回首页</button>
        </motion.div>
      </div>
    )
  }

  if (step >= 7 || !plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-thin" style={{color: '#9b9bff'}}>今日学习完成！</h2>
          <p className="text-sm" style={{color: '#5c5c78'}}>7 个模块全部完成，明天继续加油</p>
          <button onClick={onComplete} className="btn btn-primary">返回首页</button>
        </motion.div>
      </div>
    )
  }

  const currentModule = plan.modules[step]
  const meta = moduleMeta[currentModule.id] || { title: '', desc: '', emoji: '📖', color: '#5c5c78' }

  const renderModule = () => {
    switch (currentModule.id) {
      case 'new-words': return <NewWordsModule words={currentModule.words} onComplete={handleModuleComplete} />
      case 'review': return <ReviewModule words={currentModule.words} onComplete={handleModuleComplete} />
      case 'sentence': return <SentenceBuilder prompts={currentModule.prompts} learnedWords={currentModule.learnedWords || []} onComplete={handleModuleComplete} />
      case 'preposition': return <PrepositionFill questions={currentModule.questions} onComplete={handleModuleComplete} />
      case 'dictation': return <Dictation words={currentModule.words} onComplete={handleModuleComplete} />
      case 'read-aloud': return <ReadAloud sentences={currentModule.sentences} onComplete={handleModuleComplete} />
      case 'new-word-review': return <NewWordReview words={currentModule.words} onComplete={handleModuleComplete} />
      default: return <div className="text-center py-10"><button onClick={() => handleModuleComplete({})} className="btn btn-primary">跳过</button></div>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setStep(-1)} className="btn-ghost text-base px-2">←</button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{meta.emoji}</span>
            <div>
              <h2 className="text-sm font-semibold tracking-wide" style={{color: meta.color}}>第 {step + 1} 步 · {meta.title}</h2>
              <p className="text-xs mt-0.5" style={{color: '#5c5c78'}}>{meta.desc}</p>
            </div>
          </div>
          <div className="flex gap-1.5 mt-3">
            {plan.modules.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{background: i < step ? meta.color : i === step ? meta.color : 'rgba(255,255,255,0.04)'}} />
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={`${currentModule.id}-${step}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
          {renderModule()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
