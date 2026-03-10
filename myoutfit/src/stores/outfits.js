import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import {
  TOP_CATEGORIES,
  BOTTOM_CATEGORIES,
  SHOES_CATEGORIES,
  LAYER_CATEGORIES,
  CATEGORY_ROLES,
} from '../lib/constants'

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function generateOutfits(clothes, { style, season, formality } = {}) {
  let pool = clothes.filter(c => c.is_active)

  if (style) pool = pool.filter(c => !c.style || c.style === style)
  if (season) {
    pool = pool.filter(c => !c.season || c.season === season || c.season === 'toutes saisons')
  }
  if (formality) pool = pool.filter(c => !c.formality || c.formality === formality)

  const tops = pool.filter(c => TOP_CATEGORIES.includes(c.category))
  const bottoms = pool.filter(c => BOTTOM_CATEGORIES.includes(c.category))
  const shoes = pool.filter(c => SHOES_CATEGORIES.includes(c.category))
  const layers = pool.filter(c => LAYER_CATEGORIES.includes(c.category))

  if (!tops.length || !bottoms.length || !shoes.length) return []

  const variants = []
  const shuffledTops = shuffled(tops)
  const shuffledBottoms = shuffled(bottoms)
  const shuffledShoes = shuffled(shoes)

  const maxVariants = Math.min(3, shuffledTops.length, shuffledBottoms.length, shuffledShoes.length)

  for (let i = 0; i < maxVariants; i++) {
    const variant = {
      top: shuffledTops[i],
      bottom: shuffledBottoms[i],
      shoes: shuffledShoes[i],
    }
    if (layers.length) {
      variant.layer = pickRandom(layers)
    }
    variants.push(variant)
  }

  return variants
}

export const useOutfitsStore = defineStore('outfits', () => {
  const outfits = ref([])
  const loading = ref(false)

  async function fetchOutfits() {
    loading.value = true
    const { data, error } = await supabase
      .from('outfits')
      .select(`*, outfit_items(*, clothes(*))`)
      .order('created_at', { ascending: false })

    if (!error) outfits.value = data
    loading.value = false
  }

  async function saveOutfit(name, style, season, items) {
    const { data: outfit, error: outfitError } = await supabase
      .from('outfits')
      .insert([{ name, style, season }])
      .select()
      .single()

    if (outfitError) throw outfitError

    const outfitItems = items.map(item => ({
      outfit_id: outfit.id,
      clothing_id: item.clothing.id,
      role: CATEGORY_ROLES[item.clothing.category] || 'other',
    }))

    const { error: itemsError } = await supabase.from('outfit_items').insert(outfitItems)
    if (itemsError) throw itemsError

    await fetchOutfits()
    return outfit
  }

  async function deleteOutfit(id) {
    await supabase.from('outfit_items').delete().eq('outfit_id', id)
    const { error } = await supabase.from('outfits').delete().eq('id', id)
    if (error) throw error
    outfits.value = outfits.value.filter(o => o.id !== id)
  }

  return { outfits, loading, fetchOutfits, saveOutfit, deleteOutfit }
})
