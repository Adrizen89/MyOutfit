import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'
import {
  TOP_CATEGORIES,
  BOTTOM_CATEGORIES,
  SHOES_CATEGORIES,
  LAYER_CATEGORIES,
  CATEGORY_ROLES,
} from '../lib/constants'
import { colorsCompatible, formalityCompatible, outfitColorScore } from '../lib/colorCompatibility'

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function pickLayer(layers, topColor) {
  return layers.find(l => colorsCompatible(l.color, topColor)) || layers[0]
}

function candidatesForTop(top, bottoms, shoes) {
  const result = []
  for (const bottom of bottoms) {
    if (!colorsCompatible(top.color, bottom.color)) continue
    if (!formalityCompatible(top.formality, bottom.formality)) continue
    for (const shoe of shoes) {
      if (!formalityCompatible(bottom.formality, shoe.formality)) continue
      result.push({ top, bottom, shoes: shoe, score: outfitColorScore([top, bottom, shoe]) })
    }
  }
  return result
}

function buildVariants(tops, bottoms, shoes, layers, maxCount) {
  const candidates = tops.flatMap(top => candidatesForTop(top, bottoms, shoes))
  candidates.sort((a, b) => b.score - a.score || Math.random() - 0.5)

  const usedKeys = new Set()
  const variants = []

  for (const candidate of candidates) {
    const key = `${candidate.top.id}-${candidate.bottom.id}-${candidate.shoes.id}`
    if (usedKeys.has(key)) continue
    usedKeys.add(key)

    const variant = { ...candidate }
    if (layers.length) variant.layer = pickLayer(layers, candidate.top.color)
    variants.push(variant)

    if (variants.length >= maxCount) break
  }

  return variants
}

export function generateOutfits(clothes, { style, season, formality } = {}) {
  let pool = clothes.filter(c => c.is_active)

  if (style) pool = pool.filter(c => !c.style || c.style === style)
  if (season) pool = pool.filter(c => !c.season || c.season === season || c.season === 'toutes saisons')
  if (formality) pool = pool.filter(c => !c.formality || c.formality === formality)

  const tops = shuffled(pool.filter(c => TOP_CATEGORIES.includes(c.category)))
  const bottoms = shuffled(pool.filter(c => BOTTOM_CATEGORIES.includes(c.category)))
  const shoes = shuffled(pool.filter(c => SHOES_CATEGORIES.includes(c.category)))
  const layers = shuffled(pool.filter(c => LAYER_CATEGORIES.includes(c.category)))

  if (!tops.length || !bottoms.length || !shoes.length) return []

  // Essai avec contraintes strictes
  let variants = buildVariants(tops, bottoms, shoes, layers, 3)

  // Fallback sans contraintes couleur/formalité si pas assez de résultats
  if (variants.length < 1) {
    const fallbackCandidates = []
    for (let i = 0; i < Math.min(3, tops.length, bottoms.length, shoes.length); i++) {
      const variant = { top: tops[i], bottom: bottoms[i], shoes: shoes[i], score: 0 }
      if (layers.length) variant.layer = layers[i % layers.length]
      fallbackCandidates.push(variant)
    }
    variants = fallbackCandidates
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
    const auth = useAuthStore()
    const { data: outfit, error: outfitError } = await supabase
      .from('outfits')
      .insert([{ name, style, season, user_id: auth.user.id }])
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
