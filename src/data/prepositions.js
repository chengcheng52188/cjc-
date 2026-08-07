// 介词填空题库
// Each question: sentence with blank, options, answer, explanation, rule
export const prepositionQuestions = [
  {
    id: 1,
    ruleTitle: "be interested in — 对…感兴趣",
    rule: "in 用于表达兴趣、参与。固定搭配：be interested in doing sth",
    sentence: "I'm interested ___ learning English.",
    blank: "___",
    options: ["in", "on", "at", "for"],
    answer: "in",
    explanation: "be interested in 是固定搭配，表示'对...感兴趣'"
  },
  {
    id: 2,
    ruleTitle: "arrive at / in — 到达",
    rule: "arrive at + 小地方（station, airport）；arrive in + 大城市/国家",
    sentence: "She arrived ___ the airport.",
    blank: "___",
    options: ["in", "on", "at", "to"],
    answer: "at",
    explanation: "arrive at + 具体小地点；arrive in + 大地方（如城市、国家）"
  },
  {
    id: 3,
    ruleTitle: "at + 具体时间点",
    rule: "at 用于精确时间：at 8 o'clock, at noon, at midnight, at the moment",
    sentence: "The meeting starts ___ 9 o'clock.",
    blank: "___",
    options: ["in", "on", "at", "by"],
    answer: "at",
    explanation: "at + 具体时间点"
  },
  {
    id: 4,
    ruleTitle: "on — 在…表面上",
    rule: "on 表示在物体表面：on the table, on the wall, on the floor",
    sentence: "The book is ___ the table.",
    blank: "___",
    options: ["in", "on", "at", "by"],
    answer: "on",
    explanation: "on 表示在物体表面上"
  },
  {
    id: 5,
    ruleTitle: "for + 时间段 vs since + 时间点",
    rule: "for + 一段时间（two hours, three days）；since + 时间起点（yesterday, 2020）",
    sentence: "She has been waiting ___ two hours.",
    blank: "___",
    options: ["since", "for", "during", "in"],
    answer: "for",
    explanation: "for + 时间段（two hours）；since + 时间点"
  },
  {
    id: 6,
    ruleTitle: "by + 交通工具",
    rule: "by + 交通工具（不加冠词）：by bus, by train, by car, by plane, on foot（步行例外）",
    sentence: "I will go to Beijing ___ train.",
    blank: "___",
    options: ["by", "on", "in", "with"],
    answer: "by",
    explanation: "by + 交通工具 表示'乘坐...'"
  },
  {
    id: 7,
    ruleTitle: "be afraid of — 害怕…",
    rule: "of 表示所属、关于。be afraid of / be scared of / be terrified of",
    sentence: "He is afraid ___ dogs.",
    blank: "___",
    options: ["of", "from", "with", "about"],
    answer: "of",
    explanation: "be afraid of 表示'害怕...'"
  },
  {
    id: 8,
    ruleTitle: "focus on — 专注于",
    rule: "on 表示方向、集中于：focus on, concentrate on, depend on",
    sentence: "We should focus ___ the main problem.",
    blank: "___",
    options: ["on", "in", "at", "to"],
    answer: "on",
    explanation: "focus on 表示'专注于'"
  },
  {
    id: 9,
    ruleTitle: "be different from — 与…不同",
    rule: "from 表示来源、差异：different from, come from, suffer from",
    sentence: "She is different ___ her sister.",
    blank: "___",
    options: ["from", "with", "than", "to"],
    answer: "from",
    explanation: "be different from 表示'与...不同'"
  },
  {
    id: 10,
    ruleTitle: "look forward to — 期待（to 是介词！）",
    rule: "look forward to + 名词/动名词。to 在这里是介词，后面接 doing，不是 to do！常见错误：I look forward to see you ❌ → I look forward to seeing you ✅",
    sentence: "I'm looking forward ___ hearing from you.",
    blank: "___",
    options: ["to", "for", "at", "in"],
    answer: "to",
    explanation: "look forward to + doing，to 是介词，后面接动名词"
  },
  {
    id: 11,
    ruleTitle: "succeed in — 成功做某事",
    rule: "in 用于表达在某个方面。succeed in doing = 成功做了某事",
    sentence: "He succeeded ___ passing the exam.",
    blank: "___",
    options: ["in", "on", "at", "with"],
    answer: "in",
    explanation: "succeed in doing 表示'成功做了某事'"
  },
  {
    id: 12,
    ruleTitle: "be full of — 充满…",
    rule: "of 表示内容、组成：full of, consist of, made of, a lot of",
    sentence: "The room is full ___ people.",
    blank: "___",
    options: ["of", "with", "in", "by"],
    answer: "of",
    explanation: "be full of 表示'充满了...'"
  },
  {
    id: 13,
    ruleTitle: "be tired of — 厌倦…",
    rule: "of 用于表达情感对象：tired of, proud of, afraid of, fond of",
    sentence: "I'm tired ___ doing the same thing every day.",
    blank: "___",
    options: ["of", "from", "with", "about"],
    answer: "of",
    explanation: "be tired of 表示'厌倦了...'"
  },
  {
    id: 14,
    ruleTitle: "insist on — 坚持",
    rule: "on 表示坚持、依赖：insist on, depend on, rely on, count on",
    sentence: "She insisted ___ paying the bill.",
    blank: "___",
    options: ["on", "in", "at", "for"],
    answer: "on",
    explanation: "insist on doing 表示'坚持做某事'"
  },
  {
    id: 15,
    ruleTitle: "apologize for — 为…道歉",
    rule: "for 表示原因、目的：apologize for, thank for, pay for, wait for",
    sentence: "He apologized ___ being late.",
    blank: "___",
    options: ["for", "to", "about", "of"],
    answer: "for",
    explanation: "apologize for 表示'为...道歉'"
  },
  {
    id: 16,
    ruleTitle: "be worried about — 担心…",
    rule: "about 表示关于、涉及：worried about, think about, talk about, care about",
    sentence: "I'm worried ___ my exam results.",
    blank: "___",
    options: ["about", "for", "of", "with"],
    answer: "about",
    explanation: "be worried about 表示'担心...'"
  },
  {
    id: 17,
    ruleTitle: "be married to — 嫁给/娶了",
    rule: "to 表示对象、方向：married to, talk to, listen to, belong to。注意：不用 with！",
    sentence: "She is married ___ a doctor.",
    blank: "___",
    options: ["to", "with", "by", "for"],
    answer: "to",
    explanation: "be married to 表示'嫁给/娶了某人'，不用 with"
  },
  {
    id: 18,
    ruleTitle: "agree with + 人 / agree to + 事",
    rule: "agree with + 人（同意某人的看法）；agree to + 提议/计划",
    sentence: "I agree ___ you on this point.",
    blank: "___",
    options: ["with", "to", "on", "about"],
    answer: "with",
    explanation: "agree with + 人；agree to + 提议/计划"
  },
  {
    id: 19,
    ruleTitle: "be famous for — 因…出名",
    rule: "for 表示原因：famous for, known for, responsible for",
    sentence: "He is famous ___ his paintings.",
    blank: "___",
    options: ["for", "as", "in", "of"],
    answer: "for",
    explanation: "be famous for 表示'因...而出名'；be famous as 表示'作为...而出名'"
  },
  {
    id: 20,
    ruleTitle: "pay attention to — 注意",
    rule: "to 表示方向、对象：pay attention to, listen to, refer to, lead to",
    sentence: "Please pay attention ___ the teacher.",
    blank: "___",
    options: ["to", "on", "at", "for"],
    answer: "to",
    explanation: "pay attention to 表示'注意...'"
  },
  {
    id: 21,
    ruleTitle: "be responsible for — 对…负责",
    rule: "for 表示原因、负责：responsible for, famous for, grateful for",
    sentence: "She is responsible ___ the project.",
    blank: "___",
    options: ["for", "of", "to", "with"],
    answer: "for",
    explanation: "be responsible for 表示'对...负责'"
  },
  {
    id: 22,
    ruleTitle: "be used to — 习惯于（to 是介词！）",
    rule: "be used to + doing 习惯于做某事。注意：used to do = 过去常常（to 是不定式），意思完全不同！",
    sentence: "I'm used ___ getting up early.",
    blank: "___",
    options: ["to", "with", "for", "of"],
    answer: "to",
    explanation: "be used to doing 表示'习惯于做某事'，to 是介词"
  },
  {
    id: 23,
    ruleTitle: "prevent … from — 阻止…做",
    rule: "from 表示阻止、免除：prevent from, stop from, protect from, save from",
    sentence: "He prevented me ___ going out.",
    blank: "___",
    options: ["from", "of", "for", "to"],
    answer: "from",
    explanation: "prevent sb from doing 表示'阻止某人做某事'"
  },
  {
    id: 24,
    ruleTitle: "be proud of — 为…骄傲",
    rule: "of 表示情感对象：proud of, ashamed of, jealous of, envious of",
    sentence: "She is proud ___ her son's achievement.",
    blank: "___",
    options: ["of", "for", "about", "with"],
    answer: "of",
    explanation: "be proud of 表示'为...感到骄傲'"
  },
  {
    id: 25,
    ruleTitle: "devote … to — 致力于",
    rule: "devote + 时间/精力 + to + 名词/动名词。to 是介词，后接 doing。",
    sentence: "He devoted his life ___ helping others.",
    blank: "___",
    options: ["to", "for", "in", "on"],
    answer: "to",
    explanation: "devote ... to doing，to 是介词"
  },
  {
    id: 26,
    ruleTitle: "in + 大范围 / at + 具体点",
    rule: "in 用于大范围（in China, in Beijing）；at 用于具体点（at the door, at the corner）",
    sentence: "There is someone ___ the door.",
    blank: "___",
    options: ["at", "in", "on", "by"],
    answer: "at",
    explanation: "at the door 表示'在门口'这个具体位置"
  },
  {
    id: 27,
    ruleTitle: "be familiar with — 熟悉…",
    rule: "with 表示伴随、关系：familiar with, satisfied with, angry with, busy with",
    sentence: "I'm familiar ___ this area.",
    blank: "___",
    options: ["with", "to", "of", "about"],
    answer: "with",
    explanation: "be familiar with 表示'熟悉...'"
  },
  {
    id: 28,
    ruleTitle: "be angry with + 人 / be angry at + 事",
    rule: "angry with + 人；angry at/about + 事/情况",
    sentence: "He is angry ___ me.",
    blank: "___",
    options: ["with", "at", "to", "about"],
    answer: "with",
    explanation: "be angry with + 人；be angry at/about + 事"
  },
  {
    id: 29,
    ruleTitle: "be satisfied with — 对…满意",
    rule: "with 用于表达对某事的感受：satisfied with, pleased with, happy with",
    sentence: "She is satisfied ___ the result.",
    blank: "___",
    options: ["with", "of", "about", "for"],
    answer: "with",
    explanation: "be satisfied with 表示'对...满意'"
  },
  {
    id: 30,
    ruleTitle: "decide on — 决定/选定",
    rule: "on 用于决定、选定：decide on, agree on, insist on",
    sentence: "I can't decide ___ which one to choose.",
    blank: "___",
    options: ["on", "about", "for", "of"],
    answer: "on",
    explanation: "decide on 表示'决定/选定'某个选项"
  }
]
