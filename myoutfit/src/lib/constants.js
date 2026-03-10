export const CATEGORIES = [
  { value: 't-shirt', label: 'T-shirt', role: 'top' },
  { value: 'chemise', label: 'Chemise', role: 'top' },
  { value: 'pull', label: 'Pull', role: 'top' },
  { value: 'veste', label: 'Veste', role: 'layer' },
  { value: 'pantalon', label: 'Pantalon', role: 'bottom' },
  { value: 'jean', label: 'Jean', role: 'bottom' },
  { value: 'short', label: 'Short', role: 'bottom' },
  { value: 'chaussures', label: 'Chaussures', role: 'shoes' },
  { value: 'accessoire', label: 'Accessoire', role: 'accessory' },
]

export const STYLES = [
  { value: 'casual', label: 'Casual' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'chic', label: 'Chic' },
  { value: 'sport', label: 'Sport' },
]

export const SEASONS = [
  { value: 'printemps', label: 'Printemps' },
  { value: 'ete', label: 'Été' },
  { value: 'automne', label: 'Automne' },
  { value: 'hiver', label: 'Hiver' },
  { value: 'toutes saisons', label: 'Toutes saisons' },
]

export const FORMALITIES = [
  { value: 'decontracte', label: 'Décontracté' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'habille', label: 'Habillé' },
]

export const COLORS = [
  { value: 'blanc', label: 'Blanc', hex: '#FFFFFF' },
  { value: 'noir', label: 'Noir', hex: '#111111' },
  { value: 'gris', label: 'Gris', hex: '#9CA3AF' },
  { value: 'beige', label: 'Beige', hex: '#D2B48C' },
  { value: 'marron', label: 'Marron', hex: '#92400E' },
  { value: 'rouge', label: 'Rouge', hex: '#EF4444' },
  { value: 'rose', label: 'Rose', hex: '#F9A8D4' },
  { value: 'orange', label: 'Orange', hex: '#F97316' },
  { value: 'jaune', label: 'Jaune', hex: '#FCD34D' },
  { value: 'vert', label: 'Vert', hex: '#22C55E' },
  { value: 'bleu', label: 'Bleu', hex: '#3B82F6' },
  { value: 'marine', label: 'Marine', hex: '#1E3A5F' },
  { value: 'violet', label: 'Violet', hex: '#8B5CF6' },
]

export const CATEGORY_ROLES = {
  't-shirt': 'top',
  'chemise': 'top',
  'pull': 'top',
  'veste': 'layer',
  'pantalon': 'bottom',
  'jean': 'bottom',
  'short': 'bottom',
  'chaussures': 'shoes',
  'accessoire': 'accessory',
}

export const TOP_CATEGORIES = ['t-shirt', 'chemise', 'pull']
export const BOTTOM_CATEGORIES = ['pantalon', 'jean', 'short']
export const SHOES_CATEGORIES = ['chaussures']
export const LAYER_CATEGORIES = ['veste', 'pull']
export const ACCESSORY_CATEGORIES = ['accessoire']
