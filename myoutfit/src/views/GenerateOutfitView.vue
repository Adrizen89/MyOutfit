<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClothesStore } from '../stores/clothes'
import { useOutfitsStore, generateOutfits } from '../stores/outfits'
import { STYLES, SEASONS, FORMALITIES } from '../lib/constants'
import ClothingPiece from '../components/ClothingPiece.vue'

const clothesStore = useClothesStore()
const outfitsStore = useOutfitsStore()
const router = useRouter()

const loading = ref(false)
const variants = ref([])
const noResult = ref(false)
const saving = ref(null)
const saveSuccess = ref(false)

const criteria = reactive({
  style: '',
  season: '',
  formality: '',
})

onMounted(() => clothesStore.fetchClothes())

function generate() {
  loading.value = true
  noResult.value = false
  variants.value = []
  setTimeout(() => {
    const results = generateOutfits(clothesStore.clothes, criteria)
    if (!results.length) noResult.value = true
    else variants.value = results
    loading.value = false
  }, 600)
}

async function saveVariant(index, variant) {
  saving.value = index
  try {
    const name = `Tenue du ${new Date().toLocaleDateString('fr-FR')}`
    const items = [
      { clothing: variant.top },
      { clothing: variant.bottom },
      { clothing: variant.shoes },
      ...(variant.layer ? [{ clothing: variant.layer }] : []),
    ]
    await outfitsStore.saveOutfit(name, criteria.style, criteria.season, items)
    saveSuccess.value = true
    setTimeout(() => { saveSuccess.value = false }, 3000)
  } finally {
    saving.value = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-5 pt-12 pb-6 border-b border-gray-100">
      <h1 class="text-2xl font-bold text-gray-900">Générer une tenue</h1>
      <p class="text-gray-500 text-sm mt-1">Définis tes critères et laisse-toi inspirer</p>
    </div>

    <div class="px-5 py-6 space-y-6">
      <!-- Critères -->
      <div class="card p-5 space-y-4">
        <h2 class="font-bold text-gray-900">Critères</h2>

        <div>
          <label class="label">Style</label>
          <select v-model="criteria.style" class="select-field">
            <option value="">Peu importe</option>
            <option v-for="s in STYLES" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>

        <div>
          <label class="label">Saison</label>
          <select v-model="criteria.season" class="select-field">
            <option value="">Peu importe</option>
            <option v-for="s in SEASONS" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>

        <div>
          <label class="label">Formalité</label>
          <select v-model="criteria.formality" class="select-field">
            <option value="">Peu importe</option>
            <option v-for="f in FORMALITIES" :key="f.value" :value="f.value">{{ f.label }}</option>
          </select>
        </div>

        <button class="btn-primary" :disabled="loading" @click="generate">
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Génération...
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Générer une tenue
          </span>
        </button>
      </div>

      <!-- Succès sauvegarde -->
      <Transition name="slide">
        <div v-if="saveSuccess" class="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Tenue sauvegardée avec succès !
        </div>
      </Transition>

      <!-- Aucun résultat -->
      <div v-if="noResult" class="card p-6 text-center">
        <p class="text-gray-500 text-sm">Impossible de générer une tenue complète avec ces critères.</p>
        <p class="text-gray-400 text-xs mt-2">
          Il te faut au moins un haut, un bas et une paire de chaussures actifs correspondant aux critères.
        </p>
        <button class="btn-secondary mt-4" @click="router.push('/wardrobe/add')">
          Ajouter des vêtements
        </button>
      </div>

      <!-- Variantes -->
      <div v-if="variants.length" class="space-y-4">
        <h2 class="font-bold text-gray-900">
          {{ variants.length }} tenue{{ variants.length > 1 ? 's' : '' }} proposée{{ variants.length > 1 ? 's' : '' }}
        </h2>

        <div v-for="(variant, i) in variants" :key="i" class="card p-4 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-700">Variante {{ i + 1 }}</span>
            <button
              class="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
              :disabled="saving === i"
              @click="saveVariant(i, variant)"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {{ saving === i ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
          </div>

          <!-- Grille pièces -->
          <div class="grid grid-cols-2 gap-3">
            <ClothingPiece :item="variant.top" role="Haut" />
            <ClothingPiece :item="variant.bottom" role="Bas" />
            <ClothingPiece :item="variant.shoes" role="Chaussures" />
            <ClothingPiece v-if="variant.layer" :item="variant.layer" role="Couche" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
