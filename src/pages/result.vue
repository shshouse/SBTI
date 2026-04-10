<script setup lang="ts">
import { useTestStore } from '~/stores/test'
import { modelGroups } from '~/data/dimensions'
import { typeImages } from '~/data/types'
import { useHistory } from '~/composables/useHistory'

const router = useRouter()
const store = useTestStore()
const { addRecord } = useHistory()

if (!store.result) {
  router.replace('/')
}

const result = computed(() => store.result)
const typeCode = computed(() => result.value?.finalType.code ?? '')
const imageSrc = computed(() => typeImages[typeCode.value] || '')
const showShareModal = ref(false)

onMounted(() => {
  if (store.result) {
    addRecord(store.result)
  }
})

function handleRestart() {
  store.startTest()
  router.push('/test')
}

function handleHome() {
  store.reset()
  router.push('/')
}
</script>

<template>
  <div v-if="result" class="max-w-3xl mx-auto px-4 py-8 pb-16">
    <!-- Type header -->
    <div class="card overflow-hidden fade-up" style="--delay: 0ms">
      <div class="grid sm:grid-cols-2 gap-0">
        <!-- Image -->
        <div v-if="imageSrc" class="relative bg-gradient-to-br from-white to-primary-50/40 p-6 flex items-center justify-center min-h-[240px]">
          <div class="absolute -right-12 -bottom-12 w-36 h-36 rounded-full bg-gradient-to-t from-primary-100/20 to-transparent pointer-events-none" />
          <img
            :src="imageSrc"
            :alt="result.finalType.cn"
            class="max-h-[320px] w-auto object-contain relative z-10 rounded-xl"
          />
        </div>

        <!-- Type info -->
        <div class="p-6 flex flex-col justify-center">
          <span class="text-xs font-medium text-primary-600 tracking-wider uppercase mb-2">
            {{ result.modeKicker }}
          </span>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
            {{ result.finalType.code }}<br />
            <span class="text-xl sm:text-2xl text-gray-500 font-normal">{{ result.finalType.cn }}</span>
          </h1>
          <div class="inline-flex items-center gap-2 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-4 py-2 w-fit">
            <Icon name="lucide:target" class="w-3.5 h-3.5" />
            {{ result.badge }}
          </div>
          <p class="text-[13px] text-gray-400 mt-3 leading-relaxed">
            {{ result.sub }}
          </p>
        </div>
      </div>
    </div>

    <!-- Intro quote -->
    <div class="card p-5 mt-4 text-center fade-up" style="--delay: 80ms">
      <p class="text-base text-gray-600 italic">
        "{{ result.finalType.intro }}"
      </p>
    </div>

    <!-- Description -->
    <div class="card p-6 mt-4 fade-up" style="--delay: 160ms">
      <h3 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Icon name="lucide:file-text" class="w-4 h-4 text-primary-600" />
        该人格的简单解读
      </h3>
      <p class="text-[15px] leading-[1.9] text-gray-600 whitespace-pre-wrap">
        {{ result.finalType.desc }}
      </p>
    </div>

    <!-- Radar Chart -->
    <div class="card p-6 mt-4 fade-up" style="--delay: 240ms">
      <h3 class="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Icon name="lucide:radar" class="w-4 h-4 text-primary-600" />
        维度雷达图
      </h3>
      <ClientOnly>
        <RadarChart :raw-scores="result.rawScores" />
      </ClientOnly>
    </div>

    <!-- Dimensions -->
    <div class="card p-6 mt-4 fade-up" style="--delay: 320ms">
      <h3 class="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Icon name="lucide:bar-chart-3" class="w-4 h-4 text-primary-600" />
        十五维度评分
      </h3>

      <div v-for="group in modelGroups" :key="group.name" class="mb-5 last:mb-0">
        <div class="flex items-center gap-2 mb-3">
          <Icon :name="group.icon" class="w-3.5 h-3.5 text-gray-400" />
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">{{ group.name }}</span>
        </div>
        <div class="space-y-2">
          <DimensionItem
            v-for="dim in group.dims"
            :key="dim"
            :dim="dim"
            :level="result.levels[dim]"
            :score="result.rawScores[dim]"
          />
        </div>
      </div>
    </div>

    <!-- Share -->
    <div class="card p-6 mt-4 fade-up" style="--delay: 400ms">
      <h3 class="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Icon name="lucide:share-2" class="w-4 h-4 text-primary-600" />
        分享结果
      </h3>
      <ShareCard :result="result" />
    </div>

    <!-- Note -->
    <div class="card p-5 mt-4 fade-up" style="--delay: 480ms">
      <h3 class="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <Icon name="lucide:alert-circle" class="w-4 h-4 text-amber-500" />
        友情提示
      </h3>
      <p class="text-[13px] text-gray-500 leading-relaxed">
        {{ result.special
          ? '本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿把它当成医学、心理学、相学、命理学或灵异学依据。'
          : '本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。'
        }}
      </p>
    </div>

    <!-- Author note -->
    <details class="card mt-4 overflow-hidden">
      <summary class="p-5 cursor-pointer flex items-center justify-between text-sm font-semibold text-gray-800 hover:bg-gray-50/50 transition-colors">
        <span class="flex items-center gap-2">
          <Icon name="lucide:message-circle" class="w-4 h-4 text-primary-600" />
          作者的话
        </span>
        <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-400 transition-transform" />
      </summary>
      <div class="border-t border-gray-100 px-5 pb-5">
        <p class="text-[13px] text-gray-500 leading-relaxed mt-4">
          本测试首发于b站up主蛆肉儿串儿（UID417038183），初衷是劝诫一位爱喝酒的朋友戒酒。
        </p>
        <p class="text-[13px] text-gray-500 leading-relaxed mt-2">
          由于作者的人格是SHIT愤世者，所以平等的攻击了各位，在此抱歉！不过我是一个绝世大美女，你们一定会原谅我，有B站的朋友们也可以关注我。
        </p>
        <p class="text-[13px] text-gray-500 leading-relaxed mt-2">
          关于这个测试，我没法很好的平衡娱乐和专业性，因此对于一些人格的阐释较为模糊或完全不准（如屌丝可能并非真的屌丝），如有冒犯非常抱歉！
        </p>
        <p class="text-[13px] text-gray-500 leading-relaxed mt-2">
          再鉴于时间精力有限，就随便搞了一个先这样玩玩，后续会慢慢完善修改的，总之好玩为主，还请不要用于盈利呀。
        </p>
      </div>
    </details>

    <!-- Actions -->
    <div class="flex items-center justify-between gap-3 mt-6 fade-up" style="--delay: 560ms">
      <button class="btn-secondary text-sm" @click="router.push('/history')">
        <Icon name="lucide:clock" class="w-4 h-4 mr-1.5" />
        历史记录
      </button>
      <div class="flex gap-3">
      <button class="btn-secondary text-sm" @click="handleRestart">
        <Icon name="lucide:rotate-ccw" class="w-4 h-4 mr-1.5" />
        重新测试
      </button>
        <button class="btn-primary text-sm" @click="handleHome">
          <Icon name="lucide:home" class="w-4 h-4 mr-1.5" />
          回到首页
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-up {
  animation: fadeUp 0.5s ease both;
  animation-delay: var(--delay, 0ms);
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
