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
import CircularGallery from '../components/ui/CircularGallery/CircularGallery'
import '../components/ui/CircularGallery/CircularGallery.css'

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
    const galleryItems = [
      { image: import.meta.env.BASE_URL + '1.webp', text: '新词学习' },
      { image: import.meta.env.BASE_URL + '2.webp', text: '单词复习' },
      { image: import.meta.env.BASE_URL + '3.webp', text: '造句练习' },
      { image: import.meta.env.BASE_URL + '4.webp', text: '介词填空' },
      { image: import.meta.env.BASE_URL + '5.webp', text: '听写训练' },
      { image: import.meta.env.BASE_URL + '6.webp', text: '跟读练习' },
      { image: import.meta.env.BASE_URL + '7.webp', text: '新词巩固' },
    ]
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-screen -mx-5 relative" style={{ height: 380 }}>
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="#9b9bff"
            borderRadius={0.05}
            font="bold 20px sans-serif"
          />
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {plan?.modules.map((mod, i) => {
              const done = plan?.completedModules?.includes(mod.id)
              const meta = moduleMeta[mod.id]
              return (
                <button
                  key={mod.id}
                  onClick={(e) => { e.stopPropagation(); handleStart(i) }}
                  className="text-xs py-1.5 px-3 rounded-xl font-medium transition-all"
                  style={{
                    background: done ? 'rgba(255,255,255,0.04)' : meta?.color + '15',
                    color: done ? '#5c5c78' : meta?.color,
                    border: '1px solid ' + (done ? 'rgba(255,255,255,0.06)' : meta?.color + '30'),
                    textDecoration: done ? 'line-through' : 'none'
                  }}
                >
                  {meta?.title}
                </button>
              )
            })}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mt-6 space-y-4">
          <div style={{ minHeight: 60 }}>
            <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover fontSize="clamp(2rem, 6vw, 2.5rem)" fontWeight={300} color="#9b9bff">选择模块</FuzzyText>
          </div>
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
