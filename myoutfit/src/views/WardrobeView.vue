<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClothesStore } from '../stores/clothes'
import ClothingCard from '../components/ClothingCard.vue'
import { CATEGORIES, STYLES, SEASONS } from '../lib/constants'

const clothesStore = useClothesStore()
const router = useRouter()

const filterCategory = ref('')
const filterStyle = ref('')
const filterSeason = ref('')

onMounted(() => clothesStore.fetchClothes())

const filtered = computed(() => {
  let list = clothesStore.clothes
  if (filterCategory.value) list = list.filter(c => c.category === filterCategory.value)
  if (filterStyle.value) list = list.filter(c => c.style === filterStyle.value)
  if (filterSeason.value) list = list.filter(c => c.season === filterSeason.value || c.season === 'toutes saisons')
  return list
})

function resetFilters() {
  filterCategory.value = ''
  filterStyle.value = ''
  filterSeason.value = ''
}

const hasFilters = computed(() => filterCategory.value || filterStyle.value || filterSeason.value)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-5 pt-12 pb-4 border-b border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-gray-900">Mon Dressing</h1>
        <button
          class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white"
          @click="router.push('/wardrobe/add')"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- Filtres -->
      <div class="space-y-2">
        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <select v-model="filterCategory" class="text-sm border border-gray-200 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 shrink-0">
            <option value="">Toutes catégories</option>
            <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
          <select v-model="filterStyle" class="text-sm border border-gray-200 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 shrink-0">
            <option value="">Tous les styles</option>
            <option v-for="s in STYLES" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <select v-model="filterSeason" class="text-sm border border-gray-200 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 shrink-0">
            <option value="">Toutes saisons</option>
            <option v-for="s in SEASONS" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <button
            v-if="hasFilters"
            class="text-sm text-red-500 font-medium px-3 py-1.5 shrink-0"
            @click="resetFilters"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <div class="px-5 py-5">
      <!-- Loading -->
      <div v-if="clothesStore.loading" class="grid grid-cols-2 gap-3">
        <div v-for="i in 6" :key="i" class="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
      </div>

      <!-- Grille -->
      <div v-else-if="filtered.length" class="grid grid-cols-2 gap-3">
        <ClothingCard v-for="item in filtered" :key="item.id" :item="item" />
      </div>

      <!-- Vide -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p class="text-gray-400 text-sm">
          {{ hasFilters ? 'Aucun résultat pour ces filtres.' : 'Ton dressing est vide.' }}
        </p>
        <button v-if="!hasFilters" class="btn-primary mt-4 max-w-xs" @click="router.push('/wardrobe/add')">
          Ajouter un vêtement
        </button>
      </div>

      <p class="text-xs text-gray-400 text-center mt-4">
        {{ filtered.length }} vêtement{{ filtered.length > 1 ? 's' : '' }}
      </p>
    </div>
  </div>
</template>
