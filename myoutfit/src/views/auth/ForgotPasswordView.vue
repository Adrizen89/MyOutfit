<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const email = ref('')
const loading = ref(false)
const errorMsg = ref('')
const sent = ref(false)

async function handleReset() {
  if (!email.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.resetPassword(email.value)
    sent.value = true
  } catch (e) {
    errorMsg.value = e.message || 'Erreur lors de la demande de réinitialisation.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center px-6 py-12 bg-gray-50">
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold text-gray-900">MyOutfit</h1>
    </div>

    <div v-if="sent" class="card p-6 text-center">
      <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Email envoyé !</h2>
      <p class="text-gray-500 text-sm mb-6">Vérifie ta boîte mail pour réinitialiser ton mot de passe.</p>
      <RouterLink to="/login" class="btn-primary block text-center">Retour à la connexion</RouterLink>
    </div>

    <div v-else class="card p-6">
      <RouterLink to="/login" class="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 mb-6 w-fit">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="text-sm">Retour</span>
      </RouterLink>

      <h2 class="text-xl font-bold text-gray-900 mb-2">Mot de passe oublié</h2>
      <p class="text-gray-500 text-sm mb-6">Saisis ton email pour recevoir un lien de réinitialisation.</p>

      <form @submit.prevent="handleReset" class="space-y-4">
        <div>
          <label class="label">Email</label>
          <input
            v-model="email"
            type="email"
            class="input-field"
            placeholder="ton@email.com"
            required
          />
        </div>

        <div v-if="errorMsg" class="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
          {{ errorMsg }}
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading">Envoi...</span>
          <span v-else>Envoyer le lien</span>
        </button>
      </form>
    </div>
  </div>
</template>
