// Matrice de compatibilité des couleurs
// Chaque couleur liste les couleurs avec lesquelles elle se marie bien
const COMPATIBLE_COLORS = {
  noir:    ['blanc', 'gris', 'rouge', 'bleu', 'beige', 'marine', 'violet', 'rose', 'vert', 'jaune', 'orange', 'marron'],
  blanc:   ['noir', 'gris', 'bleu', 'marine', 'beige', 'rouge', 'rose', 'vert', 'violet', 'marron'],
  gris:    ['noir', 'blanc', 'bleu', 'marine', 'rouge', 'rose', 'violet', 'beige'],
  beige:   ['marron', 'blanc', 'noir', 'bleu', 'marine', 'vert', 'orange'],
  marron:  ['beige', 'blanc', 'bleu', 'marine', 'vert', 'orange', 'noir'],
  rouge:   ['noir', 'blanc', 'gris', 'marine', 'beige'],
  rose:    ['blanc', 'noir', 'gris', 'marine', 'beige', 'violet'],
  orange:  ['blanc', 'noir', 'gris', 'marine', 'marron', 'beige'],
  jaune:   ['blanc', 'noir', 'gris', 'marine', 'bleu'],
  vert:    ['blanc', 'noir', 'beige', 'marron', 'bleu'],
  bleu:    ['blanc', 'gris', 'beige', 'marine', 'marron', 'rouge', 'jaune', 'noir'],
  marine:  ['blanc', 'gris', 'beige', 'marron', 'rouge', 'bleu', 'noir'],
  violet:  ['blanc', 'noir', 'gris', 'rose', 'beige'],
}

// Retourne un score de compatibilité entre deux couleurs (0 ou 1)
export function colorsCompatible(color1, color2) {
  if (!color1 || !color2) return true // si pas de couleur définie, pas de contrainte
  if (color1 === color2) return true   // même couleur = compatible (monochrome)
  return COMPATIBLE_COLORS[color1]?.includes(color2) ?? true
}

// Score de compatibilité d'une tenue entière (0 à 1)
export function outfitColorScore(items) {
  const colors = items.map(i => i?.color).filter(Boolean)
  if (colors.length < 2) return 1

  let compatible = 0
  let total = 0
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      total++
      if (colorsCompatible(colors[i], colors[j])) compatible++
    }
  }
  return total === 0 ? 1 : compatible / total
}

// Matrice de compatibilité formalité
const FORMALITY_COMPATIBLE = {
  decontracte:   ['decontracte', 'intermediaire'],
  intermediaire: ['decontracte', 'intermediaire', 'habille'],
  habille:       ['intermediaire', 'habille'],
}

export function formalityCompatible(f1, f2) {
  if (!f1 || !f2) return true
  return FORMALITY_COMPATIBLE[f1]?.includes(f2) ?? true
}
