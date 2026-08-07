// DeepSeek API 封装 — AI 造句评分
const API_URL = 'https://api.deepseek.com/v1/chat/completions'

function getApiKey() {
  return import.meta.env.VITE_DEEPSEEK_API_KEY || ''
}

export async function gradeSentence(prompt, userSentence) {
  const apiKey = getApiKey()
  if (!apiKey) {
    return {
      error: '请先配置 DeepSeek API Key（在 .env 文件中设置 VITE_DEEPSEEK_API_KEY）',
      score: 0
    }
  }

  const systemPrompt = `你是英语老师。检查以下英文句子。
    
中文提示：${prompt}
用户翻译：${userSentence}

请指出：
1. 语法是否正确
2. 介词使用是否有误
3. 时态是否正确
4. 整体评分(1-10)
5. 正确的写法（如果有错误）

用这个 JSON 格式回复（只返回 JSON，不要其他内容）：
{
  "score": 8,
  "grammar": "语法基本正确",
  "preposition": "介词使用正确",
  "tense": "时态正确",
  "correction": "Your sentence is correct." (如果有错误，给出正确写法),
  "suggestion": "整体不错，可以尝试更地道的表达"
}`

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `请批改：${userSentence}` }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`API error: ${response.status} - ${err}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return { score: 5, suggestion: content, error: '无法解析AI回复' }
  } catch (err) {
    console.error('DeepSeek API error:', err)
    return { error: `评分失败: ${err.message}`, score: 0 }
  }
}
