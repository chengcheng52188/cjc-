import { useState, useEffect } from 'react'
import { getStreak, getStats } from '../utils/storage'

const cards = [
  {
    label: '累计学习', en: 'TOTAL DAYS', key: 'current', color: '#9b9bff',
    suffix: '天', target: 30
  },
  {
    label: '最长连续', en: 'BEST STREAK', key: 'longest', color: '#ffe08a',
    suffix: '天', target: 30
  },
  {
    label: '已学词汇', en: 'WORDS', key: 'totalWords', color: '#8be0a0',
    suffix: '个', target: 2500
  },
  {
    label: '造句练习', en: 'SENTENCES', key: 'totalSentences', color: '#e090d0',
    suffix: '次', target: 100
  }
]

const SEGMENTS = 12

/* 小蜘蛛（hover 时挂丝滑下） */
const SpideyMini = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 10.5 L8.5 6.5 M12 10.5 L15.5 6.5 M12 10.5 L6 8 M12 10.5 L18 8" />
    <path d="M12 11.5 L8.5 16 M12 11.5 L15.5 15.5 M12 11.5 L6 14 M12 11.5 L18 14" />
    <ellipse cx="12" cy="11" rx="2.4" ry="3" fill="currentColor" stroke="none" />
    <circle cx="12" cy="6.8" r="1.3" fill="currentColor" stroke="none" />
  </svg>
)

function CountUp({ value, duration = 900 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min((t - t0) / duration, 1)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return n
}

export default function Stats() {
  const [s, setS] = useState({ current: 0, longest: 0, totalWords: 0, totalTime: 0, totalSentences: 0 })
  const [pcts, setPcts] = useState({})

  useEffect(() => {
    const streak = getStreak()
    const stats = getStats()
    setS({ ...streak, ...stats })
  }, [])

  /* 数据就绪后触发：小人从 0 冲到目标（先渲染 0，再 rAF 到目标 → transition 滑翔） */
  useEffect(() => {
    const next = {}
    cards.forEach((c) => {
      next[c.key] = Math.min((s[c.key] || 0) / c.target, 1) * 100
    })
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPcts(next)))
    return () => cancelAnimationFrame(raf)
  }, [s])

  return (
    <div className="space-y-4 fade-in">
      <div className="pt-2 flex items-center gap-2.5">
        <SpideyMini className="w-4 h-4 text-[#e04040]" />
        <p className="hud-num text-sm tracking-[0.4em] glow" style={{ color: '#9b9bff' }}>STATS</p>
      </div>
      <p className="text-[11px] -mt-1.5 tracking-widest" style={{ color: '#5c5c78' }}>学习数据总览</p>

      {cards.map((c, i) => {
        const v = s[c.key] || 0
        const pct = pcts[c.key] || 0
        const lit = pct > 0 ? Math.max(1, Math.round((pct / 100) * SEGMENTS)) : 0
        const lv = Math.min(10, Math.floor(pct / 10) + 1)
        return (
          <div key={c.label} className="quest-panel" style={{ '--hc': c.color }}>
            {/* hover 小蜘蛛 */}
            <div className="hud-spider-wrap">
              <span className="hud-thread" />
              <SpideyMini className="hud-spider w-3.5 h-3.5" />
            </div>

            <div className="flex gap-4">
              <span className="quest-num">0{i + 1}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="hud-num text-[9px] tracking-[0.3em]" style={{ color: c.color, opacity: 0.75 }}>{c.en}</p>
                    <p className="text-sm mt-1" style={{ color: '#8a8aa5' }}>{c.label}</p>
                  </div>
                  <div className="text-right">
                    <span className="hud-num text-[26px] leading-none glow" style={{ color: c.color }}>
                      <CountUp value={v} />
                    </span>
                    <span className="hud-num text-[11px] ml-1" style={{ color: c.color, opacity: 0.7 }}>{c.suffix}</span>
                  </div>
                </div>

                {/* 游戏经验条 + 俯冲小人（共振） */}
                <div className="game-track">
                  <div className="game-runner" style={{ left: `${pct}%` }}>
                    <img src={`${import.meta.env.BASE_URL}spidey.webp`} alt="spidey" draggable={false} />
                    <span className="runner-ping" />
                  </div>
                  <div className="game-bar">
                    <span className="bar-scan" />
                    {Array.from({ length: SEGMENTS }).map((_, j) => (
                      <span key={j} className={j < lit ? 'seg on' : 'seg'} style={{ '--i': j }} />
                    ))}
                  </div>
                </div>

                <div className="mt-1.5 flex items-center justify-between hud-num text-[9px] tracking-[0.2em]" style={{ color: '#4a4a66' }}>
                  <span>
                    <span style={{ color: c.color }}><CountUp value={v} /></span>
                    <span> / {c.target} {c.suffix}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span style={{ color: c.color }}>{Math.round(pct)}%</span>
                    <span className="lvl-badge">LV.{lv}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Activity heatmap */}
      <div className="quest-panel" style={{ '--hc': '#64c8ff' }}>
        <div className="hud-spider-wrap">
          <span className="hud-thread" />
          <SpideyMini className="hud-spider w-3.5 h-3.5" />
        </div>
        <div className="flex gap-4">
          <span className="quest-num">05</span>
          <div className="flex-1 min-w-0">
            <p className="hud-num text-[9px] tracking-[0.3em]" style={{ color: '#64c8ff', opacity: 0.75 }}>ACTIVITY</p>
            <p className="text-sm mt-1 mb-3" style={{ color: '#8a8aa5' }}>学习热力</p>
            <div className="flex gap-1">
              {Array.from({ length: 28 }).map((_, i) => {
                const on = i < (s.current || 0)
                return (
                  <div key={i} className="hud-tick flex-1 rounded-[2px]" style={{
                    height: 22,
                    animationDelay: `${i * 45}ms`,
                    background: on
                      ? 'linear-gradient(180deg, rgba(155,155,255,0.95), rgba(100,200,255,0.45))'
                      : 'rgba(255,255,255,0.03)',
                    boxShadow: on ? '0 0 8px rgba(155,155,255,0.5)' : 'inset 0 0 4px rgba(0,0,0,0.5)',
                    border: on ? '1px solid rgba(155,155,255,0.6)' : '1px solid rgba(255,255,255,0.05)'
                  }} />
                )
              })}
            </div>
            <p className="hud-num text-[9px] mt-3 tracking-[0.25em]" style={{ color: '#3c3c52' }}>
              {s.current > 0 ? `SIGNAL ${s.current}/28 — KEEP GOING` : 'NO_SIGNAL — 坚持学习，这里会亮起来'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
