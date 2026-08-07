// SM-2 间隔重复算法
import { saveWordRecord, getWordRecord } from './storage'

// Quality 0-5 from user self-assessment
// q >= 3: correct response, schedule next review
// q < 3: incorrect, reset and relearn
export function calculateNextReview(quality, currentInterval, easeFactor) {
  if (quality >= 3) {
    if (currentInterval === 0) return { interval: 1, ease: easeFactor }
    if (currentInterval === 1) return { interval: 2, ease: easeFactor }
    const newEase = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    const ef = Math.max(1.3, newEase)
    const interval = Math.round(currentInterval * ef)
    return { interval, ease: ef }
  }
  // Reset on poor quality
  return { interval: 0, ease: easeFactor }
}

// Schedule a word review
export function scheduleWordReview(wordId, quality) {
  const record = getWordRecord(wordId) || {
    learnedAt: new Date().toISOString(),
    reviewCount: 0,
    nextReview: new Date().toISOString(),
    ease: 2.5,
    interval: 0
  }

  const { interval, ease } = calculateNextReview(quality, record.interval, record.ease)
  const nextReview = new Date(Date.now() + interval * 86400000)

  const updated = {
    ...record,
    reviewCount: record.reviewCount + 1,
    nextReview: nextReview.toISOString(),
    ease,
    interval,
    lastQuality: quality
  }

  saveWordRecord(wordId, updated)
  return updated
}

// Mark word as newly learned today
export function markWordLearned(wordId) {
  const record = {
    learnedAt: new Date().toISOString(),
    reviewCount: 0,
    nextReview: new Date(Date.now() + 86400000).toISOString(), // review tomorrow
    ease: 2.5,
    interval: 1
  }
  saveWordRecord(wordId, record)
  return record
}

// Get words due for review today
export function getWordsForReview(today, allWordRecords) {
  const todayStr = (today || new Date()).toISOString().split('T')[0]

  return Object.entries(allWordRecords || {})
    .filter(([_, record]) => {
      const reviewDate = new Date(record.nextReview).toISOString().split('T')[0]
      return reviewDate <= todayStr
    })
    .map(([id]) => parseInt(id))
}
