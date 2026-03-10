<script setup>
import { ref, onMounted } from 'vue'
import { useOutfitsStore } from '../stores/outfits'
import OutfitCard from '../components/OutfitCard.vue'
import { useRouter } from 'vue-router'

const outfitsStore = useOutfitsStore()
const router = useRouter()
const confirmId = ref(null)
const deleting = ref(false)

onMounted(() => outfitsStore.fetchOutfits())

async function handleDelete(id) {
  deleting.value = true
  try {
    await outfitsStore.deleteOutfit(id)
  } finally {
    deleting.value = false
    confirmId.value = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-5 pt-12 pb-6 border-b border-gray-100">
      <h1 class="text-2xl font-bold text-gray-900">Tenues sauvegardées</h1>
      <p class="text-gray-500 text-sm mt-1">{{ outfitsStore.outfits.length }} tenue{{ outfitsStore.outfits.length > 1 ? 's' : '' }}</p>
    </div>

    <div class="px-5 py-6">
      <!-- Loading -->
      <div v-if="outfitsStore.loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="h-40 bg-gray-200 rounded-2xl animate-pulse" />
      </div>

      <!-- Liste -->
      <div v-else-if="outfitsStore.outfits.length" class="space-y-4">
        <OutfitCard
          v-for="outfit in outfitsStore.outfits"
          :key="outfit.id"
          :outfit="outfit"
          @delete="confirmId = $event"
        />
      </div>

      <!-- Vide -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <p class="text-gray-400 text-sm">Aucune tenue sauvegardée.</p>
        <button class="btn-primary mt-4 max-w-xs" @click="router.push('/generate')">
          Générer ma première tenue
        </button>
      </div>
    </div>

    <!-- Modale confirmation suppression -->
    <Transition name="fade">
      <div v-if="confirmId" class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
        <div class="bg-white w-full max-w-lg rounded-t-3xl p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2">Supprimer cette tenue ?</h3>
          <p class="text-gray-500 text-sm mb-6">Cette action est irréversible.</p>
          <div class="space-y-3">
            <button
              class="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              :disabled="deleting"
              @click="handleDelete(confirmId)"
            >
              <span v-if="deleting">Suppression...</span>
              <span v-else>Supprimer</span>
            </button>
            <button class="btn-secondary" @click="confirmId = null">Annuler</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
