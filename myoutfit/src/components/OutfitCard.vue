<script setup>
import { computed } from 'vue'
import { STYLES, SEASONS } from '../lib/constants'

const props = defineProps({
  outfit: { type: Object, required: true },
})

defineEmits(['delete'])

const styleLabel = STYLES.find(s => s.value === props.outfit.style)?.label || props.outfit.style
const seasonLabel = SEASONS.find(s => s.value === props.outfit.season)?.label || props.outfit.season

// Trie les pièces par rôle pour un affichage cohérent : haut, bas, chaussures, couche
const ROLE_ORDER = { top: 0, bottom: 1, shoes: 2, layer: 3, accessory: 4, other: 5 }
const sortedItems = computed(() =>
  [...(props.outfit.outfit_items || [])].sort(
    (a, b) => (ROLE_ORDER[a.role] ?? 5) - (ROLE_ORDER[b.role] ?? 5),
  ),
)

const ROLE_LABELS = {
  top: 'Haut',
  bottom: 'Bas',
  shoes: 'Chaussures',
  layer: 'Couche',
  accessory: 'Accessoire',
}
</script>

<template>
  <div class="card overflow-hidden">
    <!-- Header -->
    <div class="flex items-start justify-between px-4 pt-4 pb-3">
      <div>
        <h3 class="font-bold text-gray-900">{{ outfit.name }}</h3>
        <div class="flex gap-1.5 mt-1 flex-wrap">
          <span v-if="styleLabel" class="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">{{ styleLabel }}</span>
          <span v-if="seasonLabel" class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ seasonLabel }}</span>
        </div>
      </div>
      <button
        class="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2 shrink-0"
        @click="$emit('delete', outfit.id)"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Pièces avec labels de rôle -->
    <div class="grid grid-cols-4 gap-px bg-gray-100">
      <div
        v-for="item in sortedItems.slice(0, 4)"
        :key="item.id"
        class="bg-white relative"
      >
        <div class="aspect-square bg-gray-50">
          <img
            v-if="item.clothes?.image_url"
            :src="item.clothes.image_url"
            :alt="item.clothes?.name"
            class="w-full h-full object-contain"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <!-- Label rôle -->
        <div class="absolute bottom-0 left-0 right-0 bg-black/40 py-0.5 px-1">
          <p class="text-[9px] text-white font-medium text-center truncate">
            {{ ROLE_LABELS[item.role] || item.role }}
          </p>
        </div>
      </div>

      <!-- Cellules vides si moins de 4 pièces -->
      <div
        v-for="i in Math.max(0, 4 - sortedItems.length)"
        :key="`empty-${i}`"
        class="aspect-square bg-white flex items-center justify-center"
      >
        <svg class="w-5 h-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-4 py-2.5 bg-gray-50 flex items-center justify-between">
      <p class="text-xs text-gray-400">
        {{ sortedItems.length }} pièce{{ sortedItems.length > 1 ? 's' : '' }}
      </p>
      <p class="text-xs text-gray-400">
        {{ new Date(outfit.created_at).toLocaleDateString('fr-FR') }}
      </p>
    </div>
  </div>
</template>
