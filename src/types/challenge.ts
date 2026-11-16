export type ChallengeId =
  | 'anggrek-bulan'
  | 'rafflesia-arnoldii'
  | 'bunga-melati'
  | 'bunga-sepatu'
  | 'bunga-kenanga'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Challenge {
  id: ChallengeId
  name: string
  scientificName: string
  description: string
  objective: string
  difficulty: Difficulty
  /** Soft background tint used behind the flower illustration. */
  accent: string
}