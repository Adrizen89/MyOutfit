import { ref } from 'vue'

// Convertit un File en base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Convertit un Blob en File
export function blobToFile(blob, name) {
  return new File([blob], name, { type: blob.type })
}

// Composable : suppression d'arrière-plan
export function useBackgroundRemoval() {
  const removing = ref(false)
  const error = ref(null)

  async function removeBackground(imageFile) {
    removing.value = true
    error.value = null
    try {
      const { removeBackground: removeBg } = await import('@imgly/background-removal')
      const blob = await removeBg(imageFile, {
        publicPath: 'https://unpkg.com/@imgly/background-removal@1.4.5/dist/',
      })
      return blobToFile(blob, imageFile.name.replace(/\.[^.]+$/, '.png'))
    } catch (e) {
      error.value = 'Erreur lors de la suppression du fond.'
      return null
    } finally {
      removing.value = false
    }
  }

  return { removing, error, removeBackground }
}

// Composable : analyse automatique via Edge Function Supabase
export function useClothingAnalysis() {
  const analyzing = ref(false)
  const error = ref(null)

  async function analyzeClothing(imageFile) {
    analyzing.value = true
    error.value = null
    try {
      const base64 = await fileToBase64(imageFile)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      const res = await fetch(`${supabaseUrl}/functions/v1/analyze-clothing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ image: base64, mimeType: imageFile.type }),
      })

      if (!res.ok) throw new Error('Erreur Edge Function')
      return await res.json()
    } catch (e) {
      error.value = 'Analyse impossible. Remplis les champs manuellement.'
      return null
    } finally {
      analyzing.value = false
    }
  }

  return { analyzing, error, analyzeClothing }
}
