import { useState, useEffect } from 'react'
import { getStreak, getStats } from '../utils/storage'

const cards = [
  { label: '累计学习', key: 'current', icon: '—', color: '#9b9bff', suffix: ' 天' },
  { label: '最长连续', key: 'longest', icon: '—', color: '#ffe08a', suffix: ' 天' },
  { label: '已学词汇', key: 'totalWords', icon: '—', color: '#8be0a0', suffix: ' 个' },
  { label: '造句练习', key: 'totalSentences', icon: '—', color: '#e090d0', suffix: ' 次' }
]

export default function Stats() {
  const [s, setS] = useState({ current: 0, longest: 0, totalWords: 0, totalTime: 0, totalSentences: 0 })

  useEffect(() => {
    const streak = getStreak()
    const stats = getStats()
    setS({ ...streak, ...stats })
  }, [])

  return (
    <div className="space-y-10 fade-in">
      <div className="pt-4">
        <p className="text-xs tracking-widest uppercase mb-6" style={{color: '#5c5c78'}}>统计</p>

        {cards.map((c, i) => (
          <div key={c.label}>
            <div className="flex items-center justify-between py-4 px-1">
              <span className="text-sm" style={{color: '#5c5c78'}}>{c.label}</span>
              <span className="text-lg font-light" style={{color: c.color}}>
                {s[c.key] || 0}{c.suffix}
              </span>
            </div>
            {i < cards.length - 1 && <div className="divider" />}
          </div>
        ))}
      </div>

      {/* Heatmap placeholder */}
      <div>
        <p className="text-xs tracking-widest uppercase mb-4" style={{color: '#5c5c78'}}>学习热力</p>
        <div className="flex gap-1">
          {Array.from({length: 28}).map((_, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{
              height: 20,
              background: i < (s.current || 0) ? `rgba(155,155,255,${0.1 + i * 0.03})` : 'rgba(255,255,255,0.02)'
            }} />
          ))}
        </div>
        <p className="text-xs mt-3" style={{color: '#3c3c52'}}>坚持学习，这里会亮起来</p>
      </div>
    </div>
  )
}
