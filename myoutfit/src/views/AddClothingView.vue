<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useClothesStore } from '../stores/clothes'
import { useAuthStore } from '../stores/auth'
import { CATEGORIES, STYLES, SEASONS, FORMALITIES, COLORS } from '../lib/constants'
import { useBackgroundRemoval, useClothingAnalysis } from '../lib/useImageProcessing'

const clothesStore = useClothesStore()
const auth = useAuthStore()
const router = useRouter()

const { removing, removeBackground } = useBackgroundRemoval()
const { analyzing, analyzeClothing } = useClothingAnalysis()

const loading = ref(false)
const errorMsg = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)
const analysisHint = ref('')

const form = reactive({
  name: '',
  category: '',
  color: '',
  style: '',
  season: '',
  formality: '',
  is_active: true,
  user_id: auth.user?.id,
})

async function handleImage(event) {
  const file = event.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  analysisHint.value = ''

  // Analyse automatique en arrière-plan
  const result = await analyzeClothing(file)
  if (result) {
    if (result.category && !form.category) form.category = result.category
    if (result.color && !form.color) form.color = result.color
    if (result.name && !form.name) form.name = result.name
    analysisHint.value = 'Champs pré-remplis automatiquement — vérifie et ajuste si besoin.'
  }
}

async function handleRemoveBackground() {
  if (!imageFile.value) return
  const processed = await removeBackground(imageFile.value)
  if (processed) {
    imageFile.value = processed
    imagePreview.value = URL.createObjectURL(processed)
  }
}

async function handleSubmit() {
  if (!form.name || !form.category) {
    errorMsg.value = 'Le nom et la catégorie sont obligatoires.'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    await clothesStore.addClothing({ ...form }, imageFile.value)
    router.push('/wardrobe')
  } catch (e) {
    errorMsg.value = e.message || "Erreur lors de l'ajout du vêtement."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white px-5 pt-12 pb-4 border-b border-gray-100 flex items-center gap-3">
      <button class="text-gray-400 hover:text-gray-600" @click="router.back()">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-xl font-bold text-gray-900">Ajouter un vêtement</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="px-5 py-6 space-y-5 pb-28">
      <!-- Photo -->
      <div>
        <label class="label">Photo</label>
        <label
          class="block w-full aspect-video bg-white border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-primary-400 transition-colors"
          :class="{ 'border-primary-400': imagePreview }"
        >
          <input type="file" accept="image/*" capture="environment" class="hidden" @change="handleImage" />
          <div v-if="imagePreview" class="w-full h-full relative group">
            <img :src="imagePreview" class="w-full h-full object-contain bg-gray-50" alt="Aperçu" />
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span class="text-white text-sm font-medium">Changer la photo</span>
            </div>
          </div>
          <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-sm font-medium">Prendre une photo ou choisir</span>
          </div>
        </label>

        <!-- Actions image -->
        <div v-if="imagePreview" class="flex gap-2 mt-2">
          <!-- Supprimer le fond -->
          <button
            type="button"
            class="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-2.5 px-3 rounded-xl hover:border-primary-300 hover:text-primary-600 transition-colors disabled:opacity-50"
            :disabled="removing || analyzing"
            @click="handleRemoveBackground"
          >
            <span v-if="removing" class="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ removing ? 'Traitement...' : 'Supprimer le fond' }}
          </button>
          <!-- Analyser -->
          <button
            type="button"
            class="flex-1 flex items-center justify-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-primary-100 transition-colors disabled:opacity-50"
            :disabled="analyzing || removing"
            @click="analyzeClothing(imageFile).then(r => r && Object.assign(form, { category: r.category || form.category, color: r.color || form.color, name: r.name || form.name }))"
          >
            <span v-if="analyzing" class="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {{ analyzing ? 'Analyse...' : 'Analyser' }}
          </button>
        </div>

        <!-- Hint analyse -->
        <div v-if="analysisHint" class="flex items-center gap-2 mt-2 bg-primary-50 text-primary-700 text-xs px-3 py-2 rounded-xl">
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ analysisHint }}
        </div>
      </div>

      <!-- Nom -->
      <div>
        <label class="label">Nom du vêtement <span class="text-red-500">*</span></label>
        <input v-model="form.name" type="text" class="input-field" placeholder="Ex: Jean slim bleu" required />
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
        <p v-if="form.color" class="text-xs text-gray-500 mt-1.5">
          {{ COLORS.find(c => c.value === form.color)?.label }}
        </p>
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
        <label class="label">Niveau de formalité</label>
        <select v-model="form.formality" class="select-field">
          <option value="">Non défini</option>
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
        <button type="submit" class="btn-primary" :disabled="loading || removing || analyzing">
          <span v-if="loading">Ajout en cours...</span>
          <span v-else>Ajouter le vêtement</span>
        </button>
        <button type="button" class="btn-ghost w-full mt-2" @click="router.back()">Annuler</button>
      </div>
    </form>
  </div>
</template>
