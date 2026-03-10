<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirm = ref('')
const loading = ref(false)
const errorMsg = ref('')
const success = ref(false)

async function handleRegister() {
  errorMsg.value = ''
  if (password.value !== confirm.value) {
    errorMsg.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  if (password.value.length < 6) {
    errorMsg.value = 'Le mot de passe doit contenir au moins 6 caractères.'
    return
  }
  loading.value = true
  try {
    await auth.register(email.value, password.value)
    success.value = true
  } catch (e) {
    errorMsg.value = e.message || 'Erreur lors de la création du compte.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center px-6 py-12 bg-gray-50">
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold text-gray-900">MyOutfit</h1>
      <p class="text-gray-500 mt-2 text-sm">Ton dressing intelligent</p>
    </div>

    <div v-if="success" class="card p-6 text-center">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Compte créé !</h2>
      <p class="text-gray-500 text-sm mb-6">Vérifie ton email pour confirmer ton compte.</p>
      <RouterLink to="/login" class="btn-primary block text-center">Se connecter</RouterLink>
    </div>

    <div v-else class="card p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Créer un compte</h2>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="label">Email</label>
          <input
            v-model="email"
            type="email"
            class="input-field"
            placeholder="ton@email.com"
            autocomplete="email"
            required
          />
        </div>

        <div>
          <label class="label">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            class="input-field"
            placeholder="••••••••"
            autocomplete="new-password"
            required
          />
        </div>

        <div>
          <label class="label">Confirmer le mot de passe</label>
          <input
            v-model="confirm"
            type="password"
            class="input-field"
            placeholder="••••••••"
            autocomplete="new-password"
            required
          />
        </div>

        <div v-if="errorMsg" class="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
          {{ errorMsg }}
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading">Création...</span>
          <span v-else>Créer mon compte</span>
        </button>
      </form>
    </div>

    <p class="text-center text-sm text-gray-500 mt-6">
      Déjà un compte ?
      <RouterLink to="/login" class="text-primary-600 font-semibold hover:underline">
        Se connecter
      </RouterLink>
    </p>
  </div>
</template>
