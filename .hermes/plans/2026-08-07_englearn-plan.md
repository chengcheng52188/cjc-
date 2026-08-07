# EngLearn — 英语四级冲刺 PWA 实施计划

> **For Hermes:** Implement task-by-task with TDD. Each task produces working, tested code.

**Goal:** 构建一个 PWA 英语学习应用，覆盖 CET-4 备考到雅思 5.0，聚焦句法+介词+词汇，每日 7 大模块约 58 分钟。

**Architecture:** React + Vite + Tailwind CSS 单页 PWA，localStorage 持久化，Web Speech API 处理语音，DeepSeek API 做 AI 造句评分，Vercel 部署。

**Tech Stack:** React 18, Vite, Tailwind CSS 3, Framer Motion, Web Speech API, DeepSeek API, vite-plugin-pwa

---

## 项目结构

```
englearn/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   ├── cet4-words.js      # CET-4 词库（含音标、释义、例句）
│   │   ├── prepositions.js    # 介词填空题库
│   │   └── sentence-prompts.js # 造句提示（中文→英文）
│   ├── utils/
│   │   ├── storage.js         # localStorage 封装
│   │   ├── spaced-repetition.js # SM-2 算法
│   │   ├── daily-plan.js      # 每日任务生成器
│   │   ├── deepseek.js        # DeepSeek API 调用
│   │   ├── speech.js          # Web Speech API 封装
│   │   └── stats.js           # 统计数据计算
│   ├── hooks/
│   │   ├── useProgress.js     # 学习进度 hook
│   │   └── useSpeech.js       # 语音 hook
│   ├── components/
│   │   ├── Layout.jsx         # 整体布局
│   │   ├── Dashboard.jsx      # 首页仪表盘
│   │   ├── ModuleCard.jsx     # 模块卡片
│   │   ├── WordCard.jsx       # 单词卡片（翻转）
│   │   ├── SentenceBuilder.jsx # 造句练习
│   │   ├── PrepositionFill.jsx # 介词填空
│   │   ├── Dictation.jsx      # 听写
│   │   ├── ReadAloud.jsx      # 跟读
│   │   ├── AIFeedback.jsx     # AI 反馈展示
│   │   ├── ProgressBar.jsx    # 进度条
│   │   ├── StreakBadge.jsx    # 连续打卡徽章
│   │   └── Timer.jsx          # 计时器
│   └── pages/
│       ├── Home.jsx           # 首页
│       ├── Study.jsx          # 学习页（当前模块）
│       └── Stats.jsx          # 统计页
```

---

## Task 1: 项目脚手架 + 基础配置

**Objective:** 初始化 React + Vite + Tailwind 项目，配好 PWA 插件

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `public/manifest.json`

**Step 1: 创建 package.json**

```json
{
  "name": "englearn",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Step 2: 安装依赖**

```bash
npm install react react-dom framer-motion
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer vite-plugin-pwa
```

**Step 3: 配置 vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'EngLearn — 英语四级冲刺',
        short_name: 'EngLearn',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
      }
    })
  ]
})
```

**Step 4: 配置 Tailwind + 暗色主题**

`tailwind.config.js` 配好 dark mode，`index.css` 引入 Tailwind 指令。

**Step 5: 创建 manifest.json 和基础 index.html**

**Verification:** `npm run dev` 启动成功，浏览器打开看到 "EngLearn" 文字。

---

## Task 2: CET-4 词库数据

**Objective:** 准备前 200 个高频 CET-4 词汇数据（含音标、释义、例句）

**Files:**
- Create: `src/data/cet4-words.js`

**数据格式：**

```js
export const cet4Words = [
  {
    id: 1,
    word: "abandon",
    phonetic: "/əˈbændən/",
    meaning: "v. 放弃；抛弃",
    example: "He decided to abandon his plan.",
    difficulty: 1,
    tags: ["动词", "高频"]
  },
  // ... 200 words
]
```

每个词包含：id, word, phonetic, meaning, example, difficulty(1-5), tags
按 frequency 排序，优先高频词。

**Step 1: 编写数据文件** — 包含前 50 个高频 CET-4 词汇
**Step 2: 编写数据校验测试** — 验证每个词必填字段完整
**Step 3: 补充到 200 词** — 用批量脚本或手动扩展

**Verification:** `import { cet4Words }` 成功，数组长度 >= 200。

---

## Task 3: localStorage 存储层

**Objective:** 封装 localStorage 操作，管理学习记录

**Files:**
- Create: `src/utils/storage.js`

**数据结构：**

```js
// 学习记录
{
  words: { [wordId]: { learnedAt, reviewCount, nextReview, ease, interval } },
  dailyProgress: { [date]: { modulesCompleted: [], wordsLearned: 0, timeSpent: 0 } },
  streak: { current: 0, longest: 0, lastStudyDate: null },
  stats: { totalWords: 0, totalTime: 0, totalSentences: 0 },
  settings: { dailyWordGoal: 20, darkMode: true }
}
```

**API:**
- `getProgress()` / `saveProgress(data)`
- `getWordRecord(id)` / `saveWordRecord(id, data)`
- `getDailyProgress(date)` / `saveDailyProgress(date, data)`
- `getStreak()` / `updateStreak()`
- `getStats()` / `updateStats(data)`

**Step 1: 编写 storage.js 全部方法**
**Step 2: 编写单元测试验证读写一致性**

**Verification:** 写入后关闭浏览器再打开，数据不丢失。

---

## Task 4: SM-2 间隔重复算法

**Objective:** 实现标准 SM-2 算法，决定单词复习时间

**Files:**
- Create: `src/utils/spaced-repetition.js`

**算法逻辑：**
- 质量评分 0-5（用户自评 or 根据答题正确率）
- q >= 3: 进入间隔复习
- q < 3: 重置间隔，重新学习
- 间隔：1天 → 2天 → 4天 → 7天 → 15天 → 30天...

**API:**
- `calculateNextReview(quality, currentInterval, easeFactor)`
- `getWordsForReview(today)` — 返回今天该复习的词
- `getNewWords(count)` — 返回待学新词

**Verification:** 模拟学习 10 个词，验证不同评分下间隔计算正确。

---

## Task 5: 每日任务生成器

**Objective:** 根据学习历史和 SM-2 结果，生成每日 7 模块任务

**Files:**
- Create: `src/utils/daily-plan.js`

**任务结构：**

```js
{
  date: "2026-08-07",
  modules: [
    { id: "new-words", title: "新词学习", words: [...20], estimatedTime: 10 },
    { id: "review", title: "单词复习", words: [...n], estimatedTime: 8 },
    { id: "sentence", title: "造句练习", prompts: [...5], estimatedTime: 8 },
    { id: "preposition", title: "介词填空", questions: [...10], estimatedTime: 8 },
    { id: "dictation", title: "听写", words: [...10], estimatedTime: 8 },
    { id: "read-aloud", title: "跟读", sentences: [...5], estimatedTime: 8 },
    { id: "new-word-review", title: "新词复习", words: [...20], estimatedTime: 8 }
  ],
  totalTime: 58
}
```

**Step 1: 实现 generateDailyPlan()**
**Step 2: 测试：连续生成 3 天计划，验证复习词按 SM-2 递增**

**Verification:** 每天生成的任务不重复，复习词按算法推送。

---

## Task 6: DeepSeek API 封装

**Objective:** 封装 AI 造句评分接口

**Files:**
- Create: `src/utils/deepseek.js`, `.env.example`

**API:** POST `https://api.deepseek.com/v1/chat/completions`

**Prompt 模板：**

```
你是英语老师。检查以下英文句子，指出：
1. 语法是否正确
2. 介词使用是否有误
3. 时态是否正确
4. 整体评分(1-10)和改进建议

中文提示：{prompt}
用户输入：{sentence}

用中文回复，格式简洁清晰。
```

**API:**
- `gradeSentence(prompt, sentence)` → `{ score, grammar, preposition, tense, suggestion }`

**Step 1: 编写 deepseek.js，包含错误处理和重试**
**Step 2: Mock 测试（不耗 API quota）**

**Verification:** 实际调用一次，验证返回结构化评分。

---

## Task 7: Web Speech API 封装

**Objective:** 封装浏览器语音合成(TTS)和语音识别(STT)

**Files:**
- Create: `src/utils/speech.js`, `src/hooks/useSpeech.js`

**API:**
- `speakWord(word)` — TTS 朗读单词
- `speakSentence(sentence)` — TTS 朗读句子
- `startListening()` → Promise<string> — STT 识别
- `compareSpeech(expected, actual)` — 跟读准确率计算

**Step 1: 实现 speech.js，处理浏览器兼容性**
**Step 2: 实现 useSpeech hook**
**Step 3: 测试朗读和识别功能**

**Verification:** 浏览器中朗读一个单词，能听到发音；跟读识别能返回文字。

---

## Task 8: UI 组件 — 布局 + 仪表盘

**Objective:** 构建应用外壳和首页

**Files:**
- Create: `src/components/Layout.jsx`, `src/components/Dashboard.jsx`, `src/components/ProgressBar.jsx`, `src/components/StreakBadge.jsx`, `src/components/ModuleCard.jsx`, `src/components/Timer.jsx`
- Modify: `src/App.jsx`, `src/index.css`

**设计规范：**
- 暗色主题：`bg-slate-900` 主背景，`text-slate-100` 主文字
- 强调色：`emerald-400` (正确/完成), `amber-400` (进行中/警示)
- 字体：系统默认 sans-serif，保持干净
- 移动端：底部导航栏，桌面端：侧边栏
- 卡片：`bg-slate-800 rounded-2xl` + 微妙阴影

**Dashboard 布局：**

```
┌─────────────────────────────────────┐
│  🔥 连续 7 天  │  📚 已学 120 词    │
│  ───────────────────────────────    │
│  📊 今日进度  ████████░░ 65%        │
│                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ 新词  │ │ 复习  │ │ 造句  │        │
│  │ 10min │ │ 8min  │ │ 8min  │        │
│  │ ⏳    │ │ ✅    │ │ ⏳    │        │
│  └──────┘ └──────┘ └──────┘        │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ 介词  │ │ 听写  │ │ 跟读  │        │
│  │ 8min  │ │ 8min  │ │ 8min  │        │
│  │ ⏳    │ │ ⏳    │ │ ⏳    │        │
│  └──────┘ └──────┘ └──────┘        │
│  ┌──────┐                          │
│  │新词复习│                          │
│  │ 8min  │                          │
│  │ ⏳    │                          │
│  └──────┘                          │
└─────────────────────────────────────┘
```

**Step 1: 创建 Layout 组件（顶部栏 + 底部导航）**
**Step 2: 创建 Dashboard 组件**
**Step 3: 创建 ProgressBar, StreakBadge, ModuleCard, Timer**
**Step 4: 组装到 App.jsx**

**Verification:** 桌面端和移动端（Chrome DevTools 模拟）都能正常显示。

---

## Task 9: 新词学习模块

**Objective:** 翻转卡片式背单词，支持发音

**Files:**
- Create: `src/components/WordCard.jsx`, `src/pages/Study.jsx`

**交互流程：**
1. 显示英文单词 + 音标
2. 点击翻转 → 显示中文释义 + 例句
3. 扬声器按钮：朗读单词
4. "认识" / "不认识" 两个按钮
5. 20 个词轮完自动结束

**动画：** Framer Motion 卡片翻转 + 左右滑入/滑出

**Step 1: 实现 WordCard 翻转动画**
**Step 2: 实现 Study 页面单词轮播逻辑**
**Step 3: 点击"认识/不认识"记录到 localStorage**

**Verification:** 学习 20 个新词，翻页流畅，数据正确保存。

---

## Task 10: 造句练习 + AI 评分

**Objective:** 给中文提示，用户输入英文，AI 评分

**Files:**
- Create: `src/components/SentenceBuilder.jsx`, `src/components/AIFeedback.jsx`
- Create: `src/data/sentence-prompts.js`

**流程：**
1. 显示中文句子（如："我昨天在图书馆遇到了一位老朋友"）
2. 用户输入英文
3. 提交 → 调用 DeepSeek API → 显示评分和修改建议
4. 限时 8 分钟，可做 5-6 题

**Step 1: 创建 sentence-prompts.js（20+ 道题）**
**Step 2: 实现 SentenceBuilder 组件**
**Step 3: 实现 AIFeedback 动画弹出**
**Step 4: 集成 DeepSeek API**

**Verification:** 输入正确句子 → 高分；输入错误句子 → 指出具体错误。

---

## Task 11: 介词填空

**Objective:** 介词专项练习，限时 8 分钟

**Files:**
- Create: `src/components/PrepositionFill.jsx`
- Create: `src/data/prepositions.js`

**题型示例：**
```
I'm interested ___ learning English.
选项：[in, on, at, for]  → 正确答案: in

She arrived ___ the airport ___ 8 o'clock.
填空：___ the airport → at; ___ 8 o'clock → at
```

**题库：** 50+ 道题，覆盖 in/on/at/to/for/with/by/from/about/of

**Step 1: 创建介词题库**
**Step 2: 实现填空组件（点击选项 / 输入填空）**
**Step 3: 即时反馈正确/错误 + 显示解析**

**Verification:** 做 10 题，正确率统计准确。

---

## Task 12: 听写模块

**Objective:** TTS 朗读单词，用户拼写

**Files:**
- Create: `src/components/Dictation.jsx`

**流程：**
1. 播放单词发音（可重播）
2. 用户输入拼写
3. 提交 → 对比正确拼写 → 显示结果
4. 重播按钮：播放正常语速例句

**Step 1: 集成 speech.speakWord()**
**Step 2: 实现听写界面（输入框 + 播放按钮）**
**Step 3: 实现拼写比对和结果展示**

**Verification:** 听发音 → 输入正确拼写 → ✅；输入错误 → 显示正确拼写。

---

## Task 13: 跟读模块

**Objective:** 显示句子，用户朗读，语音识别比对

**Files:**
- Create: `src/components/ReadAloud.jsx`

**流程：**
1. 显示英文句子
2. 点击"开始朗读" → 录音
3. 停止 → 语音识别结果与原文比对
4. 显示准确率 + 标红读错的部分
5. 可点击"示范朗读"听标准发音

**Step 1: 集成 useSpeech hook**
**Step 2: 实现跟读界面（录音按钮 + 波形动画）**
**Step 3: 实现文本比对算法（逐词对比）**

**Verification:** 朗读一句话 → 识别结果与原文比对 → 准确率展示。

---

## Task 14: 新词复习模块

**Objective:** 当天学的 20 个新词快速复习

**Files:**
- Modify: `src/pages/Study.jsx`（添加复习模式）

**流程：**
1. 快速展示今天学的词（英文 → 点击 → 中文）
2. 每个词 20 秒，自动翻页
3. 不认识的词标记，之后再次出现
4. 最后统计掌握率

**Step 1: 实现快速复习模式**
**Step 2: 标记不认识 → 重排到队尾**
**Step 3: 结束时显示掌握率**

**Verification:** 标记 3 个不认识 → 它们重新出现 → 最终掌握率更新。

---

## Task 15: 统计页面

**Objective:** 学习数据可视化

**Files:**
- Create: `src/pages/Stats.jsx`, `src/utils/stats.js`

**展示内容：**
- 累计学习天数 / 连续打卡天数
- 已学词汇数 / 掌握率
- 每日学习时长趋势图（简易柱状图）
- 各模块完成率
- 薄弱项分析（哪种题型正确率最低）
- 累计造句数 / AI 平均评分

**Step 1: 实现 stats.js 数据聚合函数**
**Step 2: 实现 Stats 页面（纯 CSS 柱状图）**
**Step 3: 集成到 App 导航**

**Verification:** 学习几天后，统计数据准确更新。

---

## Task 16: PWA 配置 + 离线支持

**Objective:** 配置 Service Worker，支持离线使用和安装

**Files:**
- Modify: `vite.config.js`, `public/manifest.json`

**Step 1: 完善 vite-plugin-pwa 配置（缓存策略）**
**Step 2: 创建 PWA 图标（192x192 + 512x512）**
**Step 3: 测试离线访问 + 添加到主屏幕**

**Verification:** 断网后仍能打开应用，复习已加载的词。

---

## Task 17: 部署到 Vercel

**Objective:** 一键部署，获得公网 URL

**Files:**
- Create: `vercel.json`

**Step 1: 创建 vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**Step 2: 推送到 GitHub，连接 Vercel 自动部署**
**Step 3: 手机打开 URL → 添加到主屏幕 → 验证 PWA 安装**

**Verification:** 手机主屏幕出现 EngLearn 图标，点击全屏打开。

---

## 风险与注意事项

1. **Web Speech API 兼容性** — Chrome/Safari 支持好，Firefox 部分支持。移动端 Chrome 完美。
2. **DeepSeek API 费用** — 每次造句约消耗 500 tokens，每天 5-6 次约 3000 tokens，成本极低。
3. **localStorage 限制** — 5-10MB 足够存储学习记录；词库在代码中不占存储。
4. **首次加载** — 词库数据较大（~50KB），用动态 import 拆分。

---

## 执行顺序

```
T1(脚手架) → T2(词库) → T3(存储) → T4(SM2) → T5(日计划)
    ↓
T6(DeepSeek) + T7(语音) → T8(UI布局) → T9~T14(各模块)
    ↓
T15(统计) → T16(PWA) → T17(部署)
```

T1-T5 是基础，必须按顺序。T6-T7 可并行。T9-T14 可并行（不同子代理同时开发）。
