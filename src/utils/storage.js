// localStorage 存储层
const STORAGE_KEY = 'englearn'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : getDefaultData()
  } catch {
    return getDefaultData()
  }
}

function getDefaultData() {
  return {
    words: {},
    dailyProgress: {},
    streak: { current: 0, longest: 0, lastStudyDate: null },
    stats: { totalWords: 0, totalTime: 0, totalSentences: 0 }
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Word records
export function getWordRecord(wordId) {
  const data = load()
  return data.words[wordId] || null
}

export function saveWordRecord(wordId, record) {
  const data = load()
  data.words[wordId] = record
  save(data)
}

export function getAllWordRecords() {
  return load().words
}

// Daily progress
export function getDailyProgress(date) {
  const data = load()
  const key = typeof date === 'string' ? date : date.toISOString().split('T')[0]
  return data.dailyProgress[key] || {}
}

export function saveDailyProgress(date, progress) {
  const data = load()
  const key = typeof date === 'string' ? date : date.toISOString().split('T')[0]
  data.dailyProgress[key] = { ...data.dailyProgress[key], ...progress }
  save(data)
}

export function getTodayProgress() {
  return getDailyProgress(new Date())
}

// Module completion
export function markModuleCompleted(moduleId) {
  const today = new Date().toISOString().split('T')[0]
  const progress = getDailyProgress(today)
  const completed = progress.modulesCompleted || []
  if (!completed.includes(moduleId)) {
    completed.push(moduleId)
  }
  saveDailyProgress(today, { modulesCompleted: completed })
}

export function isModuleCompleted(moduleId) {
  const progress = getTodayProgress()
  return (progress.modulesCompleted || []).includes(moduleId)
}

// Streak
export function getStreak() {
  return load().streak
}

export function updateStreak() {
  const data = load()
  const today = new Date().toISOString().split('T')[0]
  const { lastStudyDate, current, longest } = data.streak

  if (lastStudyDate === today) {
    return data.streak // already updated today
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const newCurrent = lastStudyDate === yesterday ? current + 1 : 1
  const newLongest = Math.max(newCurrent, longest)

  data.streak = {
    current: newCurrent,
    longest: newLongest,
    lastStudyDate: today
  }
  save(data)
  return data.streak
}

// Stats
export function getStats() {
  return load().stats
}

export function updateStats(delta) {
  const data = load()
  data.stats = { ...data.stats, ...delta }
  save(data)
}

// Full data access
export function getAllData() {
  return load()
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY)
}
