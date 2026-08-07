// 造句提示（中文 → 英文）
// Practice sentence construction, prepositions, and tenses
export const sentencePrompts = [
  {
    id: 1,
    chinese: "我昨天在图书馆学了一下午英语。",
    english: "I studied English at the library all afternoon yesterday.",
    hint: "yesterday, library, afternoon, study English",
    keyPoints: ["过去时", "at the library", "all afternoon"],
    focus: "地点介词 + 时间表达",
    usingWords: []  // generic words, always available
  },
  {
    id: 2,
    chinese: "她对学习新语言非常感兴趣。",
    english: "She is very interested in learning new languages.",
    hint: "interested in, learning new languages",
    keyPoints: ["be interested in", "介词 in"],
    focus: "be interested in 搭配",
    usingWords: []
  },
  {
    id: 3,
    chinese: "自从去年起，他就在这家公司工作。",
    english: "He has worked at this company since last year.",
    hint: "since last year, work at this company",
    keyPoints: ["现在完成时", "since", "at"],
    focus: "since + 时间点；完成时",
    usingWords: []
  },
  {
    id: 4,
    chinese: "我每天早上七点坐公交车去上班。",
    english: "I go to work by bus at seven o'clock every morning.",
    hint: "every morning, 7 o'clock, by bus, go to work",
    keyPoints: ["一般现在时", "at 7", "by bus"],
    focus: "时间介词 at + 交通方式 by",
    usingWords: []
  },
  {
    id: 5,
    chinese: "如果你有问题，可以找经理帮忙。",
    english: "If you have any questions, you can ask the manager for help.",
    hint: "if, have questions, ask the manager for help",
    keyPoints: ["条件句", "ask for help"],
    focus: "条件句 + ask for 搭配",
    usingWords: []
  },
  {
    id: 6,
    chinese: "这本书比那本有趣得多。",
    english: "This book is much more interesting than that one.",
    hint: "this book, much more interesting than that one",
    keyPoints: ["比较级", "much more"],
    focus: "比较级 + much 修饰",
    usingWords: []
  },
  {
    id: 7,
    chinese: "他花了很多时间准备这次考试。",
    english: "He spent a lot of time preparing for this exam.",
    hint: "spend a lot of time, prepare for the exam",
    keyPoints: ["spend ... doing", "prepare for"],
    focus: "spend time doing + prepare for",
    usingWords: []
  },
  {
    id: 8,
    chinese: "我期待着下个月去北京旅行。",
    english: "I am looking forward to traveling to Beijing next month.",
    hint: "look forward to, travel to Beijing next month",
    keyPoints: ["look forward to doing", "travel to"],
    focus: "look forward to + 动名词",
    usingWords: []
  },
  {
    id: 9,
    chinese: "尽管下雨了，我们还是去了公园。",
    english: "Although it rained, we still went to the park.",
    hint: "although it rained, still go to the park",
    keyPoints: ["although", "过去时"],
    focus: "although 让步状语从句",
    usingWords: []
  },
  {
    id: 10,
    chinese: "这是我读过的最好的书之一。",
    english: "This is one of the best books I have ever read.",
    hint: "one of the best books, I have ever read",
    keyPoints: ["最高级", "现在完成时"],
    focus: "one of + 最高级 + 完成时",
    usingWords: []
  },
  {
    id: 11,
    chinese: "我们不应该依赖别人来解决自己的问题。",
    english: "We should not depend on others to solve our own problems.",
    hint: "shouldn't depend on others, solve our own problems",
    keyPoints: ["depend on", "情态动词"],
    focus: "depend on 介词搭配",
    usingWords: []
  },
  {
    id: 12,
    chinese: "她成功地通过了驾照考试。",
    english: "She succeeded in passing the driving test.",
    hint: "succeed in passing, driving test",
    keyPoints: ["succeed in doing", "过去时"],
    focus: "succeed in + 动名词",
    usingWords: []
  },
  {
    id: 13,
    chinese: "我习惯在睡前读一会儿书。",
    english: "I am used to reading for a while before going to bed.",
    hint: "be used to reading, before going to bed",
    keyPoints: ["be used to doing", "before doing"],
    focus: "be used to + 动名词",
    usingWords: []
  },
  {
    id: 14,
    chinese: "这个问题很难，但我相信你能解决它。",
    english: "This problem is very difficult, but I believe you can solve it.",
    hint: "difficult problem, believe you can solve it",
    keyPoints: ["but 转折", "believe + 从句"],
    focus: "并列句 + 宾语从句",
    usingWords: []
  },
  {
    id: 15,
    chinese: "我们应该充分利用每一个学习的机会。",
    english: "We should make full use of every learning opportunity.",
    hint: "make full use of, every learning opportunity",
    keyPoints: ["make use of", "情态动词 should"],
    focus: "make use of 固定搭配",
    usingWords: []
  },
  {
    id: 16,
    chinese: "他不仅会说英语，还会说法语。",
    english: "He can not only speak English but also speak French.",
    hint: "not only speak English, but also speak French",
    keyPoints: ["not only ... but also", "can"],
    focus: "not only ... but also 并列结构",
    usingWords: []
  },
  {
    id: 17,
    chinese: "我一到家就开始做作业。",
    english: "I started doing my homework as soon as I got home.",
    hint: "as soon as I got home, start doing homework",
    keyPoints: ["as soon as", "过去时"],
    focus: "as soon as 时间状语从句",
    usingWords: []
  },
  {
    id: 18,
    chinese: "这个城市的空气污染越来越严重了。",
    english: "The air pollution in this city is getting worse and worse.",
    hint: "air pollution in this city, getting worse and worse",
    keyPoints: ["比较级", "现在进行时"],
    focus: "比较级 + 越来越...",
    usingWords: []
  },
  {
    id: 19,
    chinese: "你有没有想过将来要做什么？",
    english: "Have you ever thought about what you want to do in the future?",
    hint: "have you ever thought about, what you want to do in the future",
    keyPoints: ["现在完成时", "think about"],
    focus: "完成时 + think about",
    usingWords: []
  },
  {
    id: 20,
    chinese: "比起看电视，我更喜欢读书。",
    english: "I prefer reading books to watching TV.",
    hint: "prefer reading books to watching TV",
    keyPoints: ["prefer ... to ...", "动名词"],
    focus: "prefer doing A to doing B",
    usingWords: []
  }
]
