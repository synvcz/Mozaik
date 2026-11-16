import type { ChallengeId, Difficulty } from '../types/challenge'
import type { GuideShape, TemplateId } from '../types/editor'
import type { GalleryCategory } from '../types/gallery'
import { CHALLENGES } from './challenges'

export interface TemplateInfo {
  id: TemplateId
  kind: 'flower' | 'icon'
  flowerId?: ChallengeId
  name: string
  subtitle: string
  description: string
  objective: string
  difficulty: Difficulty
  accent: string
  guide: GuideShape[]
}

const ellipse = (cx: number, cy: number, rx: number, ry: number, rotation = 0): GuideShape => ({
  kind: 'ellipse',
  cx,
  cy,
  rx,
  ry,
  rotation,
})
const path = (d: string): GuideShape => ({ kind: 'path', d })

function ring(count: number, rx: number, ry: number, distance: number, offset = 0): GuideShape[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = offset + (i * 360) / count
    const rad = (angle * Math.PI) / 180
    return ellipse(distance * Math.sin(rad), -distance * Math.cos(rad), rx, ry, angle)
  })
}

const FLOWER_GUIDES: Record<ChallengeId, GuideShape[]> = {
  'anggrek-bulan': [
    ellipse(0, -27, 7, 16),
    ellipse(-14, 17, 9, 17, 35),
    ellipse(14, 17, 9, 17, -35),
    ellipse(-19, -6, 21, 17, -18),
    ellipse(19, -6, 21, 17, 18),
    ellipse(0, 9, 7, 10),
    ellipse(0, -3, 3.5, 3.5),
  ],
  'rafflesia-arnoldii': [...ring(5, 19, 21, 20), ellipse(0, 0, 12, 12), ellipse(0, 0, 8, 8)],
  'bunga-melati': [...ring(8, 7, 18, 18), ...ring(8, 5, 12, 12, 22.5), ellipse(0, 0, 5, 5)],
  'bunga-sepatu': [
    ...ring(5, 16, 20, 17),
    ellipse(0, 0, 4, 4),
    path('M0 0L16 -24'),
    ellipse(16, -24, 2.4, 2.4),
  ],
  'bunga-kenanga': [...ring(6, 5, 22, 21), ...ring(6, 4, 18, 17, 30), ellipse(0, 0, 4, 4)],
}

const FLOWER_TEMPLATES: TemplateInfo[] = CHALLENGES.map((c) => ({
  id: c.id,
  kind: 'flower',
  flowerId: c.id,
  name: c.name,
  subtitle: c.scientificName,
  description: c.description,
  objective: c.objective,
  difficulty: c.difficulty,
  accent: c.accent,
  guide: FLOWER_GUIDES[c.id],
}))

export const ICON_TEMPLATES: TemplateInfo[] = [
  {
    id: 'gunungan',
    kind: 'icon',
    name: 'Gunungan',
    subtitle: 'Wayang kulit',
    description:
      'The mountain-shaped puppet that opens and closes a wayang kulit shadow-puppet performance, often decorated with a tree of life.',
    objective: 'Fill the leaf-shaped silhouette and add a tree of life with branches.',
    difficulty: 'Medium',
    accent: '#EFE3D0',
    guide: [
      path('M0 -46C20 -26 30 -4 26 22C23 38 12 46 0 46C-12 46 -23 38 -26 22C-30 -4 -20 -26 0 -46Z'),
      path('M0 -14V38'),
      path('M0 4Q12 -4 14 -14'),
      path('M0 4Q-12 -4 -14 -14'),
      path('M0 20Q10 14 12 6'),
      path('M0 20Q-10 14 -12 6'),
      ellipse(0, -28, 4, 4),
    ],
  },
  {
    id: 'rumah-gadang',
    kind: 'icon',
    name: 'Rumah Gadang',
    subtitle: 'West Sumatra',
    description:
      'The traditional house of the Minangkabau people of West Sumatra, famous for its sweeping, buffalo-horn-shaped roofs.',
    objective: 'Build the upswept horn roof first, then the walls, door and stilts.',
    difficulty: 'Medium',
    accent: '#F1DDD0',
    guide: [
      path('M-46 -22C-40 -14 -30 -6 -20 -4L20 -4C30 -6 40 -14 46 -22C44 -4 36 6 30 8L-30 8C-36 6 -44 -4 -46 -22Z'),
      path('M-14 -4L0 -22L14 -4'),
      path('M-30 8H30V30H-30Z'),
      path('M-6 30V18H6V30'),
      path('M-26 30V44M-10 30V44M10 30V44M26 30V44'),
    ],
  },
  {
    id: 'borobudur',
    kind: 'icon',
    name: 'Candi Borobudur',
    subtitle: 'Central Java',
    description:
      'The ninth-century Buddhist temple in Central Java, built as stacked terraces crowned with a central stupa.',
    objective: 'Stack the terraces from wide to narrow and finish with the stupa.',
    difficulty: 'Easy',
    accent: '#E3E6DA',
    guide: [
      path('M-44 42H44V32H-44Z'),
      path('M-36 32H36V22H-36Z'),
      path('M-28 22H28V12H-28Z'),
      path('M-20 12H20V2H-20Z'),
      path('M-13 2A13 13 0 0 1 13 2Z'),
      path('M0 -11V-24'),
    ],
  },
  {
    id: 'tumpeng',
    kind: 'icon',
    name: 'Tumpeng',
    subtitle: 'Festive rice',
    description:
      'A cone of festive rice served at celebrations and thanksgiving feasts across Java and beyond, usually surrounded by side dishes.',
    objective: 'Shape the rice cone, set it on a plate and add colorful side dishes.',
    difficulty: 'Easy',
    accent: '#F2EBC9',
    guide: [
      path('M0 -40L26 14Q28 22 18 22L-18 22Q-28 22 -26 14Z'),
      ellipse(0, 30, 42, 10),
      ellipse(0, -40, 3, 3),
      ellipse(-30, 28, 7, 4),
      ellipse(30, 28, 7, 4),
    ],
  },
]

export const ALL_TEMPLATES: TemplateInfo[] = [...FLOWER_TEMPLATES, ...ICON_TEMPLATES]
export { FLOWER_TEMPLATES }

export function getTemplate(id: TemplateId | null): TemplateInfo | undefined {
  return id ? ALL_TEMPLATES.find((t) => t.id === id) : undefined
}

export function categoryFor(id: TemplateId | null): GalleryCategory {
  if (!id) return 'Freeform'
  if (id === 'borobudur' || id === 'rumah-gadang') return 'Landmarks'
  if (id === 'gunungan' || id === 'tumpeng') return 'Culture'
  return 'Flowers'
}