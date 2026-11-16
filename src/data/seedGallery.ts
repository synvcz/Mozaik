import { createId } from '../lib/id'
import type { FabricPattern, FabricPiece, PieceShape } from '../types/editor'
import type { GalleryArtwork } from '../types/gallery'

const round = (v: number) => Math.round(v)

function piece(
  shape: PieceShape,
  pattern: FabricPattern,
  color: string,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation = 0,
): FabricPiece {
  return { id: createId(), shape, pattern, color, x, y, width, height, rotation }
}

const bg = (color: string) => piece('rect', 'plain', color, 400, 300, 800, 600)

function petals(
  cx: number,
  cy: number,
  count: number,
  length: number,
  width: number,
  pattern: FabricPattern,
  color: string,
  offset = 0,
): FabricPiece[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = offset + (i * 360) / count
    const rad = (angle * Math.PI) / 180
    const d = length / 2
    return piece('petal', pattern, color, round(cx + d * Math.sin(rad)), round(cy - d * Math.cos(rad)), width, length, angle)
  })
}

const melati = (): FabricPiece[] => [
  bg('#A7B69A'),
  piece('leaf', 'plain', '#315C48', 250, 450, 230, 120, -10),
  piece('leaf', 'batik', '#315C48', 550, 450, 230, 120, 100),
  ...petals(400, 270, 8, 190, 74, 'plain', '#FFFDF8'),
  ...petals(400, 270, 8, 130, 54, 'kawung', '#EFE6D2', 22.5),
  piece('circle', 'polka', '#E4C98E', 400, 270, 76, 76),
]

const hibiscus = (): FabricPiece[] => [
  bg('#E8D8C3'),
  piece('leaf', 'plain', '#315C48', 200, 480, 220, 110, -15),
  piece('leaf', 'kawung', '#3E7C7B', 600, 480, 220, 110, 105),
  ...petals(400, 300, 5, 230, 150, 'parang', '#B5472E'),
  ...petals(400, 300, 5, 140, 86, 'batik', '#D9654A', 36),
  piece('circle', 'plain', '#6E2A1D', 400, 300, 64, 64),
  piece('petal', 'plain', '#E4C98E', 455, 220, 16, 120, 38),
]

const borobudur = (): FabricPiece[] => [
  bg('#F1D9CF'),
  piece('circle', 'polka', '#C77D55', 620, 130, 110, 110),
  piece('triangle', 'plain', '#8A4F36', 400, 185, 40, 80),
  piece('circle', 'floral', '#E4C98E', 400, 270, 110, 110),
  piece('rect', 'kawung', '#315C48', 400, 310, 280, 70),
  piece('rect', 'batik', '#8A4F36', 400, 380, 400, 70),
  piece('rect', 'parang', '#6B3F5E', 400, 450, 520, 70),
  piece('rect', 'kawung', '#2F4B6E', 400, 520, 640, 70),
]

const tumpeng = (): FabricPiece[] => [
  bg('#E3EBDD'),
  piece('circle', 'plain', '#F8F6F0', 400, 470, 640, 150),
  piece('circle', 'polka', '#315C48', 190, 470, 110, 64),
  piece('circle', 'batik', '#C77D55', 610, 470, 110, 64),
  piece('triangle', 'floral', '#E4C98E', 400, 300, 300, 300),
  piece('petal', 'plain', '#B5472E', 400, 150, 36, 80),
]

const rafflesia = (): FabricPiece[] => [
  bg('#315C48'),
  piece('leaf', 'batik', '#A7B69A', 170, 500, 200, 100, -15),
  piece('leaf', 'batik', '#A7B69A', 630, 500, 200, 100, 105),
  ...petals(400, 300, 5, 220, 160, 'polka', '#B5472E'),
  piece('circle', 'plain', '#6E2A1D', 400, 300, 150, 150),
  piece('circle', 'plain', '#3D1710', 400, 300, 90, 90),
]

const kenanga = (): FabricPiece[] => [
  bg('#F2EBC9'),
  ...petals(400, 300, 6, 240, 70, 'plain', '#D8C34C'),
  ...petals(400, 300, 6, 180, 56, 'batik', '#C4B03A', 30),
  piece('circle', 'plain', '#7C6B1F', 400, 300, 50, 50),
]

const NOW = Date.now()
const HOUR = 3_600_000

export function createSeedGallery(): GalleryArtwork[] {
  return [
    { id: 'seed-melati', title: 'Melati at Dawn', author: 'Sari', description: 'Jasmine petals on a sage morning.', pieces: melati(), category: 'Flowers', likes: 87, likedByMe: false, createdAt: NOW - 5 * HOUR },
    { id: 'seed-sepatu', title: 'Hibiscus Bloom', author: 'Budi', description: 'A bold parang hibiscus with a golden stamen.', pieces: hibiscus(), category: 'Flowers', likes: 63, likedByMe: false, createdAt: NOW - 26 * HOUR },
    { id: 'seed-borobudur', title: 'Borobudur Sunrise', author: 'Dewi', description: 'Terraces in kawung and batik under a terracotta sun.', pieces: borobudur(), category: 'Landmarks', likes: 41, likedByMe: false, createdAt: NOW - 50 * HOUR },
    { id: 'seed-tumpeng', title: 'Tumpeng Celebration', author: 'Agus', description: 'A festive rice cone with colorful side dishes.', pieces: tumpeng(), category: 'Culture', likes: 29, likedByMe: false, createdAt: NOW - 70 * HOUR },
    { id: 'seed-rafflesia', title: 'Rafflesia Giant', author: 'Rina', description: 'The giant flower in polka-dot fabric.', pieces: rafflesia(), category: 'Flowers', likes: 120, likedByMe: false, createdAt: NOW - 100 * HOUR },
    { id: 'seed-kenanga', title: 'Kenanga Fan', author: 'Made', description: 'Long, slender petals fanned out in yellow-green.', pieces: kenanga(), category: 'Flowers', likes: 18, likedByMe: false, createdAt: NOW - 140 * HOUR },
  ]
}