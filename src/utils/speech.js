// Web Speech API 封装

// TTS — Text to Speech
export function speakWord(word, rate = 0.9) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      console.warn('SpeechSynthesis not supported')
      resolve()
      return
    }
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = rate
    utterance.onend = resolve
    utterance.onerror = resolve
    window.speechSynthesis.speak(utterance)
  })
}

export function speakSentence(sentence, rate = 0.85) {
  return speakWord(sentence, rate)
}

// STT — Speech to Text
export function startListening(lang = 'en-US') {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      reject(new Error('SpeechRecognition not supported'))
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      resolve(transcript)
    }

    recognition.onerror = (event) => {
      reject(new Error(`Speech recognition error: ${event.error}`))
    }

    recognition.onend = () => {
      // May resolve or reject already
    }

    recognition.start()
  })
}

// Compare spoken text with expected text
export function compareSpeech(expected, actual) {
  const expectedLower = expected.toLowerCase().trim()
  const actualLower = actual.toLowerCase().trim()

  const expectedWords = expectedLower.split(/\s+/)
  const actualWords = actualLower.split(/\s+/)

  let matchedWords = 0
  const result = expectedWords.map(word => {
    const match = actualWords.includes(word.replace(/[.,!?]/g, ''))
    if (match) matchedWords++
    return { word, match }
  })

  const accuracy = expectedWords.length > 0
    ? Math.round((matchedWords / expectedWords.length) * 100)
    : 0

  return {
    accuracy,
    matchedWords,
    totalWords: expectedWords.length,
    words: result,
    transcript: actual
  }
}
