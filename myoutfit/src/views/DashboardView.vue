<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useClothesStore } from '../stores/clothes'
import { useOutfitsStore, generateOutfits } from '../stores/outfits'
import ClothingCard from '../components/ClothingCard.vue'
import DailyOutfitCard from '../components/DailyOutfitCard.vue'

const auth = useAuthStore()
const clothesStore = useClothesStore()
const outfitsStore = useOutfitsStore()
const router = useRouter()

onMounted(async () => {
  await clothesStore.fetchClothes()
  await outfitsStore.fetchOutfits()
})

const stats = computed(() => ({
  total: clothesStore.clothes.length,
  active: clothesStore.clothes.filter(c => c.is_active).length,
  outfits: outfitsStore.outfits.length,
}))

const recentClothes = computed(() => clothesStore.clothes.slice(0, 4))

const today = computed(() => {
  return new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
})

const dailySuggestions = computed(() => {
  const clothes = clothesStore.clothes
  const defs = [
    { label: 'Look casual', style: 'casual', emoji: '👟' },
    { label: 'Look chic', style: 'chic', emoji: '👔' },
    { label: 'Look sport', style: 'sport', emoji: '🏃' },
  ]
  return defs.map(def => ({
    ...def,
    variant: generateOutfits(clothes, { style: def.style })[0] || null,
  }))
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-5 pt-12 pb-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-400 text-xs capitalize">{{ today }}</p>
          <h1 class="text-2xl font-bold text-gray-900 mt-0.5">Bonjour 👋</h1>
        </div>
        <button class="text-gray-400 hover:text-gray-600 transition-colors" @click="auth.logout()">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>

    <div class="py-6 space-y-6">
      <!-- Stats -->
      <div class="px-5 grid grid-cols-3 gap-3">
        <div class="card p-4 text-center">
          <p class="text-2xl font-bold text-primary-600">{{ stats.total }}</p>
          <p class="text-xs text-gray-500 mt-1">Vêtements</p>
        </div>
        <div class="card p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
          <p class="text-xs text-gray-500 mt-1">Actifs</p>
        </div>
        <div class="card p-4 text-center">
          <p class="text-2xl font-bold text-violet-600">{{ stats.outfits }}</p>
          <p class="text-xs text-gray-500 mt-1">Tenues</p>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="px-5 grid grid-cols-2 gap-3">
        <button
          class="card p-4 flex flex-col items-center gap-2 text-center hover:border-primary-200 transition-colors active:scale-95 duration-150"
          @click="router.push('/wardrobe/add')"
        >
          <div class="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span class="text-sm font-semibold text-gray-800">Ajouter un vêtement</span>
        </button>

        <button
          class="card p-4 flex flex-col items-center gap-2 text-center hover:border-primary-200 transition-colors active:scale-95 duration-150"
          @click="router.push('/generate')"
        >
          <div class="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <span class="text-sm font-semibold text-gray-800">Générer une tenue</span>
        </button>
      </div>

      <!-- Tenues du jour -->
      <div v-if="clothesStore.clothes.length">
        <div class="px-5 mb-3">
          <h2 class="text-base font-bold text-gray-900">Tenues proposées aujourd'hui</h2>
        </div>
        <div class="flex gap-3 overflow-x-auto px-5 pb-2" style="-webkit-overflow-scrolling: touch;">
          <DailyOutfitCard
            v-for="s in dailySuggestions"
            :key="s.style"
            :label="s.label"
            :style="s.style"
            :variant="s.variant"
            :emoji="s.emoji"
          />
        </div>
      </div>

      <!-- Ajouts récents -->
      <div v-if="recentClothes.length" class="px-5">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-base font-bold text-gray-900">Ajouts récents</h2>
          <RouterLink to="/wardrobe" class="text-sm text-primary-600 font-medium">Voir tout</RouterLink>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <ClothingCard v-for="item in recentClothes" :key="item.id" :item="item" />
        </div>
      </div>

      <!-- État vide -->
      <div v-else-if="!clothesStore.loading" class="px-5">
        <div class="card p-8 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p class="text-gray-500 text-sm">Ton dressing est vide pour l'instant.</p>
          <button class="btn-primary mt-4" @click="router.push('/wardrobe/add')">
            Ajouter mon premier vêtement
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
