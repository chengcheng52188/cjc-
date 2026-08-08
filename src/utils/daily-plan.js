// 每日任务生成器
import { cet4Words } from '../data/cet4-words'
import { getAllWordRecords, getDailyProgress } from './storage'
import { getWordsForReview, markWordLearned } from './spaced-repetition'
import { sentencePrompts } from '../data/sentence-prompts'
import { prepositionQuestions } from '../data/prepositions'

export function generateDailyPlan() {
  const allRecords = getAllWordRecords()
  const learnedIds = Object.keys(allRecords).map(Number)
  const today = new Date()
  const todayIndex = Math.floor(today.getTime() / 86400000)

  // 1. New words: pick 20 unlearned words, day-rotated window so each day offers a fresh set
  const unlearnedSorted = cet4Words
    .filter(w => !learnedIds.includes(w.id))
    .sort((a, b) => a.difficulty - b.difficulty) // easier first
  const unlearned = (() => {
    const n = unlearnedSorted.length
    if (!n) return []
    const start = (todayIndex * 20) % n
    return [...unlearnedSorted.slice(start), ...unlearnedSorted.slice(0, start)].slice(0, 20)
  })()

  // 2. Review words: words due for review via SM-2
  const reviewIds = getWordsForReview(today, allRecords)
  const reviewWords = cet4Words.filter(w => reviewIds.includes(w.id))
  // Limit to avoid overwhelming
  const reviewLimit = Math.min(reviewWords.length, 15)

  // 3. Sentence prompts: pick 6, prioritize those using learned words
  const learnedWords = cet4Words.filter(w => learnedIds.includes(w.id))
  // Get learned word strings for filtering
  const learnedWordSet = new Set(learnedWords.map(w => w.word.toLowerCase()))
  
  // Score each prompt by how many learned words it uses
  const scoredPrompts = sentencePrompts.map(p => {
    const englishWords = (p.english || '').toLowerCase().split(/\s+/).map(w => w.replace(/[.,!?;:'"]/g, ''))
    const matchCount = englishWords.filter(w => learnedWordSet.has(w)).length
    return { ...p, matchCount }
  })
  
  // Sort: higher match count first, then cycle by day
  scoredPrompts.sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount
    return 0
  })
  
  // Rotate by day to vary prompts
  const dayOffset = todayIndex % scoredPrompts.length
  const rotatedPrompts = [...scoredPrompts.slice(dayOffset), ...scoredPrompts.slice(0, dayOffset)]
  const sentenceSlice = rotatedPrompts.slice(0, 6)
  if (sentenceSlice.length < 6) {
    sentenceSlice.push(...sentencePrompts.slice(0, 6 - sentenceSlice.length))
  }

  // 4. Preposition questions: pick 10
  const prepSlice = prepositionQuestions.slice(
    (todayIndex * 10) % prepositionQuestions.length,
    ((todayIndex * 10) % prepositionQuestions.length) + 10
  )

  // 5. Dictation words: pick 10, day-rotated mix of new + learned
  const learnedSorted = cet4Words.filter(w => learnedIds.includes(w.id))
  const dictPool = [...unlearned, ...learnedSorted]
  const dictationWords = (() => {
    const n = dictPool.length
    if (!n) return []
    const start = (todayIndex * 10) % n
    return [...dictPool.slice(start), ...dictPool.slice(0, start)].slice(0, 10)
  })()

  // 6. Read-aloud sentences: pick 5
  const readAloudSentences = sentencePrompts.slice(
    ((todayIndex * 3) + 100) % sentencePrompts.length,
    ((todayIndex * 3) + 100) % sentencePrompts.length + 5
  )

  return {
    date: today.toISOString().split('T')[0],
    modules: [
      {
        id: 'new-words',
        title: '新词学习',
        icon: '🆕',
        words: unlearned,
        estimatedTime: 10,
        color: 'emerald'
      },
      {
        id: 'review',
        title: '单词复习',
        icon: '🔁',
        words: reviewWords.slice(0, reviewLimit),
        estimatedTime: 8,
        color: 'blue'
      },
      {
        id: 'sentence',
        title: '造句练习',
        icon: '🏗️',
        prompts: sentenceSlice.slice(0, 6),
        learnedWords: learnedWords.map(w => w.word).slice(0, 30),
        estimatedTime: 8,
        color: 'purple'
      },
      {
        id: 'preposition',
        title: '介词填空',
        icon: '🎯',
        questions: prepSlice.slice(0, 10),
        estimatedTime: 8,
        color: 'amber'
      },
      {
        id: 'dictation',
        title: '听写训练',
        icon: '🎧',
        words: dictationWords,
        estimatedTime: 8,
        color: 'rose'
      },
      {
        id: 'read-aloud',
        title: '跟读练习',
        icon: '🗣️',
        sentences: readAloudSentences.slice(0, 5),
        estimatedTime: 8,
        color: 'cyan'
      },
      {
        id: 'new-word-review',
        title: '新词复习',
        icon: '📝',
        words: unlearned,
        estimatedTime: 8,
        color: 'indigo'
      }
    ],
    totalTime: 58
  }
}

// Get today's plan, checking what's been completed
export function getTodayPlan() {
  const plan = generateDailyPlan()
  const progress = getDailyProgress(plan.date)

  return {
    ...plan,
    completedModules: progress.modulesCompleted || [],
    modulesComplete: (progress.modulesCompleted || []).length,
    totalModules: plan.modules.length
  }
}
