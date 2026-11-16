import type { Challenge } from '../types/challenge'

export const CHALLENGES: Challenge[] = [
  {
    id: 'anggrek-bulan',
    name: 'Anggrek Bulan',
    scientificName: 'Phalaenopsis amabilis',
    description:
      'The moon orchid, one of Indonesia\u2019s national flowers, with broad white petals and graceful arching sprays.',
    objective: 'Layer broad pale petals around a small, colorful lip.',
    difficulty: 'Medium',
    accent: '#F3E6EC',
  },
  {
    id: 'rafflesia-arnoldii',
    name: 'Rafflesia Arnoldii',
    scientificName: 'Rafflesia arnoldii',
    description:
      'One of the largest single flowers on Earth, from the rainforests of Sumatra. It lives on a host vine.',
    objective: 'Cut five thick petals around a dark center, then add spotted fabric.',
    difficulty: 'Hard',
    accent: '#F1D9CF',
  },
  {
    id: 'bunga-melati',
    name: 'Bunga Melati',
    scientificName: 'Jasminum sambac',
    description:
      'Jasmine, a small, fragrant white flower and national flower of Indonesia, often woven into wedding garlands.',
    objective: 'Use small plain pieces for rounded petals around a golden center.',
    difficulty: 'Easy',
    accent: '#E6EBDD',
  },
  {
    id: 'bunga-sepatu',
    name: 'Bunga Sepatu',
    scientificName: 'Hibiscus rosa-sinensis',
    description:
      'The hibiscus: bold, with large overlapping petals and a long central stamen. Its name means \u201Cshoe flower\u201D.',
    objective: 'Overlap five broad, bright petals and add a long stamen.',
    difficulty: 'Easy',
    accent: '#F6DDD3',
  },
  {
    id: 'bunga-kenanga',
    name: 'Bunga Kenanga',
    scientificName: 'Cananga odorata',
    description:
      'A sweetly scented flower with long, twisting yellow-green petals, prized in perfume and traditional ceremonies.',
    objective: 'Fan long, narrow pieces in warm yellow-green tones from the center.',
    difficulty: 'Medium',
    accent: '#F2EBC9',
  },
]