import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useClothesStore = defineStore('clothes', () => {
  const clothes = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchClothes() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('clothes')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) {
      error.value = err.message
    } else {
      clothes.value = data
    }
    loading.value = false
  }

  async function addClothing(clothing, imageFile) {
    let image_url = null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('clothes')
        .upload(fileName, imageFile, { contentType: imageFile.type })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('clothes')
        .getPublicUrl(uploadData.path)
      image_url = urlData.publicUrl
    }

    const { data, error: err } = await supabase
      .from('clothes')
      .insert([{ ...clothing, image_url }])
      .select()
      .single()

    if (err) throw err
    clothes.value.unshift(data)
    return data
  }

  async function updateClothing(id, updates, imageFile) {
    let image_url = updates.image_url

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('clothes')
        .upload(fileName, imageFile, { contentType: imageFile.type })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('clothes')
        .getPublicUrl(uploadData.path)
      image_url = urlData.publicUrl
    }

    const { data, error: err } = await supabase
      .from('clothes')
      .update({ ...updates, image_url, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    const index = clothes.value.findIndex(c => c.id === id)
    if (index !== -1) clothes.value[index] = data
    return data
  }

  async function deleteClothing(id) {
    const { error: err } = await supabase.from('clothes').delete().eq('id', id)
    if (err) throw err
    clothes.value = clothes.value.filter(c => c.id !== id)
  }

  async function toggleActive(id) {
    const item = clothes.value.find(c => c.id === id)
    if (!item) return
    await updateClothing(id, { is_active: !item.is_active })
  }

  return { clothes, loading, error, fetchClothes, addClothing, updateClothing, deleteClothing, toggleActive }
})
