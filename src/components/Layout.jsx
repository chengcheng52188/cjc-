import { motion } from 'framer-motion'

const tabs = [
  { id: 'home', label: '学习' },
  { id: 'stats', label: '统计' }
]

export default function Layout({ children, currentPage, onNavigate, hideNav }) {
  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto relative">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-base font-semibold tracking-widest uppercase" style={{color: '#5c5c78', letterSpacing: '0.15em'}}>
          englearn
        </h1>
        <span className="tag">CET-4</span>
      </header>

      <main className="flex-1 px-5 pb-28">
        {children}
      </main>

      {!hideNav && (
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-1 p-1 rounded-2xl border"
          style={{background: 'rgba(20,20,40,0.92)', borderColor: 'var(--color-border)', backdropFilter: 'blur(20px)'}}>
          {tabs.map(tab => {
            const active = currentPage === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  color: active ? '#0d0d1a' : '#5c5c78',
                  background: active ? 'var(--color-accent)' : 'transparent'
                }}
              >
                {active && (
                  <motion.div layoutId="navbg" className="absolute inset-0 rounded-xl"
                    style={{background: 'var(--color-accent)'}}
                    transition={{type: 'spring', stiffness: 500, damping: 30}} />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
      )}
    </div>
  )
}
