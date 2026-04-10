import { defineStore } from 'pinia'
import { questions, specialQuestions, DRUNK_TRIGGER_QUESTION_ID } from '~/data/questions'
import type { Question, SpecialQuestion } from '~/data/questions'
import { dimensionOrder, dimensionMeta } from '~/data/dimensions'
import type { DimensionKey, Level } from '~/data/dimensions'
import { typeLibrary, normalTypes } from '~/data/types'
import type { PersonalityType } from '~/data/types'

export interface TestResult {
  rawScores: Record<DimensionKey, number>
  levels: Record<DimensionKey, Level>
  finalType: PersonalityType
  modeKicker: string
  badge: string
  sub: string
  special: boolean
  secondaryType: (PersonalityType & { similarity: number; exact: number }) | null
  bestNormal: PersonalityType & { similarity: number; exact: number; distance: number }
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function sumToLevel(score: number): Level {
  if (score <= 3) return 'L'
  if (score === 4) return 'M'
  return 'H'
}

function levelNum(level: string): number {
  return { L: 1, M: 2, H: 3 }[level] ?? 2
}

function parsePattern(pattern: string): string[] {
  return pattern.replace(/-/g, '').split('')
}

export const useTestStore = defineStore('test', {
  state: () => ({
    shuffledQuestions: [] as (Question | SpecialQuestion)[],
    answers: {} as Record<string, number>,
    result: null as TestResult | null,
  }),

  getters: {
    visibleQuestions(state): (Question | SpecialQuestion)[] {
      const visible = [...state.shuffledQuestions]
      const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1')
      if (gateIndex !== -1 && state.answers['drink_gate_q1'] === 3) {
        visible.splice(gateIndex + 1, 0, specialQuestions[1])
      }
      return visible
    },

    totalQuestions(): number {
      return this.visibleQuestions.length
    },

    answeredCount(state): number {
      return this.visibleQuestions.filter(q => state.answers[q.id] !== undefined).length
    },

    progress(): number {
      return this.totalQuestions ? (this.answeredCount / this.totalQuestions) * 100 : 0
    },

    isComplete(): boolean {
      return this.answeredCount === this.totalQuestions && this.totalQuestions > 0
    },
  },

  actions: {
    startTest() {
      this.answers = {}
      this.result = null
      const shuffledRegular = shuffle(questions)
      const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1
      this.shuffledQuestions = [
        ...shuffledRegular.slice(0, insertIndex),
        specialQuestions[0],
        ...shuffledRegular.slice(insertIndex),
      ]
    },

    setAnswer(questionId: string, value: number) {
      this.answers[questionId] = value
      if (questionId === 'drink_gate_q1' && value !== 3) {
        delete this.answers['drink_gate_q2']
      }
    },

    computeResult(): TestResult {
      const rawScores = {} as Record<DimensionKey, number>
      const levels = {} as Record<DimensionKey, Level>

      for (const dim of Object.keys(dimensionMeta) as DimensionKey[]) {
        rawScores[dim] = 0
      }

      for (const q of questions) {
        rawScores[q.dim] += Number(this.answers[q.id] || 0)
      }

      for (const [dim, score] of Object.entries(rawScores)) {
        levels[dim as DimensionKey] = sumToLevel(score)
      }

      const userVector = dimensionOrder.map(dim => levelNum(levels[dim]))

      const ranked = normalTypes.map(type => {
        const vector = parsePattern(type.pattern).map(levelNum)
        let distance = 0
        let exact = 0
        for (let i = 0; i < vector.length; i++) {
          const diff = Math.abs(userVector[i] - vector[i])
          distance += diff
          if (diff === 0) exact += 1
        }
        const similarity = Math.max(0, Math.round((1 - distance / 30) * 100))
        return { ...type, ...typeLibrary[type.code], distance, exact, similarity }
      }).sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance
        if (b.exact !== a.exact) return b.exact - a.exact
        return b.similarity - a.similarity
      })

      const bestNormal = ranked[0]
      const drunkTriggered = this.answers[DRUNK_TRIGGER_QUESTION_ID] === 2

      let finalType: PersonalityType
      let modeKicker = '你的主类型'
      let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`
      let sub = '维度命中度较高，当前结果可视为你的第一人格画像。'
      let special = false
      let secondaryType: (PersonalityType & { similarity: number; exact: number }) | null = null

      if (drunkTriggered) {
        finalType = typeLibrary.DRUNK
        secondaryType = bestNormal
        modeKicker = '隐藏人格已激活'
        badge = '匹配度 100% · 酒精异常因子已接管'
        sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。'
        special = true
      } else if (bestNormal.similarity < 60) {
        finalType = typeLibrary.HHHH
        modeKicker = '系统强制兜底'
        badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`
        sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。'
        special = true
      } else {
        finalType = bestNormal
      }

      this.result = {
        rawScores,
        levels,
        finalType,
        modeKicker,
        badge,
        sub,
        special,
        secondaryType,
        bestNormal,
      }

      return this.result
    },

    reset() {
      this.shuffledQuestions = []
      this.answers = {}
      this.result = null
    },
  },
})
