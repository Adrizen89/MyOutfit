<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClothesStore } from '../stores/clothes'
import { CATEGORIES, STYLES, SEASONS, FORMALITIES, COLORS } from '../lib/constants'

const clothesStore = useClothesStore()
const router = useRouter()
const route = useRoute()

const id = route.params.id
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const errorMsg = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)
const showDeleteConfirm = ref(false)

const form = reactive({
  name: '',
  category: '',
  color: '',
  style: '',
  season: '',
  formality: '',
  is_active: true,
  image_url: '',
})

onMounted(async () => {
  loading.value = true
  await clothesStore.fetchClothes()
  const item = clothesStore.clothes.find(c => c.id === id)
  if (item) {
    Object.assign(form, item)
    imagePreview.value = item.image_url || null
  }
  loading.value = false
})

function handleImage(event) {
  const file = event.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

async function handleSave() {
  if (!form.name || !form.category) {
    errorMsg.value = 'Le nom et la catégorie sont obligatoires.'
    return
  }
  saving.value = true
  errorMsg.value = ''
  try {
    await clothesStore.updateClothing(id, { ...form }, imageFile.value)
    router.push('/wardrobe')
  } catch (e) {
    errorMsg.value = e.message || 'Erreur lors de la modification.'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  deleting.value = true
  try {
    await clothesStore.deleteClothing(id)
    router.push('/wardrobe')
  } catch (e) {
    errorMsg.value = e.message || 'Erreur lors de la suppression.'
    deleting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-5 pt-12 pb-4 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button class="text-gray-400 hover:text-gray-600" @click="router.back()">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-gray-900">Modifier</h1>
      </div>
      <button class="text-red-400 hover:text-red-600 transition-colors" @click="showDeleteConfirm = true">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>

    <form v-else @submit.prevent="handleSave" class="px-5 py-6 space-y-5 pb-28">
      <!-- Photo -->
      <div>
        <label class="label">Photo</label>
        <label class="block w-full aspect-video bg-white border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-primary-400 transition-colors">
          <input type="file" accept="image/*" class="hidden" @change="handleImage" />
          <div v-if="imagePreview" class="w-full h-full relative group">
            <img :src="imagePreview" class="w-full h-full object-cover" alt="Aperçu" />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span class="text-white text-sm font-medium">Changer la photo</span>
            </div>
          </div>
          <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <span class="text-sm font-medium">Ajouter une photo</span>
          </div>
        </label>
      </div>

      <!-- Nom -->
      <div>
        <label class="label">Nom <span class="text-red-500">*</span></label>
        <input v-model="form.name" type="text" class="input-field" required />
      </div>

      <!-- Catégorie -->
      <div>
        <label class="label">Catégorie <span class="text-red-500">*</span></label>
        <select v-model="form.category" class="select-field" required>
          <option value="" disabled>Choisir une catégorie</option>
          <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
      </div>

      <!-- Couleur -->
      <div>
        <label class="label">Couleur principale</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in COLORS"
            :key="color.value"
            type="button"
            class="w-8 h-8 rounded-full border-2 transition-transform active:scale-90"
            :style="{ backgroundColor: color.hex, borderColor: form.color === color.value ? '#7c3aed' : '#e5e7eb' }"
            :class="form.color === color.value ? 'scale-110 shadow-md' : ''"
            :title="color.label"
            @click="form.color = form.color === color.value ? '' : color.value"
          />
        </div>
      </div>

      <!-- Style -->
      <div>
        <label class="label">Style</label>
        <select v-model="form.style" class="select-field">
          <option value="">Non défini</option>
          <option v-for="s in STYLES" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>

      <!-- Saison -->
      <div>
        <label class="label">Saison</label>
        <select v-model="form.season" class="select-field">
          <option value="">Non définie</option>
          <option v-for="s in SEASONS" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>

      <!-- Formalité -->
      <div>
        <label class="label">Formalité</label>
        <select v-model="form.formality" class="select-field">
          <option value="">Non définie</option>
          <option v-for="f in FORMALITIES" :key="f.value" :value="f.value">{{ f.label }}</option>
        </select>
      </div>

      <!-- Statut -->
      <div class="flex items-center justify-between card px-4 py-3">
        <div>
          <p class="font-medium text-gray-800 text-sm">Vêtement actif</p>
          <p class="text-xs text-gray-400 mt-0.5">Inclus dans la génération de tenues</p>
        </div>
        <button
          type="button"
          class="relative w-12 h-6 rounded-full transition-colors duration-200"
          :class="form.is_active ? 'bg-primary-600' : 'bg-gray-300'"
          @click="form.is_active = !form.is_active"
        >
          <span
            class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
            :class="form.is_active ? 'translate-x-6' : 'translate-x-0.5'"
          />
        </button>
      </div>

      <!-- Erreur -->
      <div v-if="errorMsg" class="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
        {{ errorMsg }}
      </div>

      <!-- Boutons -->
      <div class="pt-2">
        <button type="submit" class="btn-primary" :disabled="saving">
          <span v-if="saving">Enregistrement...</span>
          <span v-else>Enregistrer les modifications</span>
        </button>
        <button type="button" class="btn-ghost w-full mt-2" @click="router.back()">Annuler</button>
      </div>
    </form>

    <!-- Modale confirmation suppression -->
    <Transition name="fade">
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
        <div class="bg-white w-full max-w-lg rounded-t-3xl p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2">Supprimer ce vêtement ?</h3>
          <p class="text-gray-500 text-sm mb-6">Cette action est irréversible.</p>
          <div class="space-y-3">
            <button
              class="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors"
              :disabled="deleting"
              @click="handleDelete"
            >
              <span v-if="deleting">Suppression...</span>
              <span v-else>Supprimer</span>
            </button>
            <button class="btn-secondary" @click="showDeleteConfirm = false">Annuler</button>
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
