import { ArrowRight } from 'lucide-react'
import { startTemplate } from '../../lib/editorActions'
import type { Challenge } from '../../types/challenge'
import ActionButton from '../common/ActionButton'
import DifficultyBadge from '../common/DifficultyBadge'
import FlowerIllustration from './FlowerIllustration'

export default function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <article className="group flex w-[250px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-forest/10 bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-xl lg:w-auto">
      <div className="grid place-items-center p-6" style={{ backgroundColor: challenge.accent }}>
        <FlowerIllustration
          id={challenge.id}
          className="h-32 w-32 transition-transform duration-700 ease-out group-hover:rotate-[24deg] group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold text-forest">{challenge.name}</h3>
        <p className="text-xs italic text-ink-soft">{challenge.scientificName}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{challenge.description}</p>
        <div className="mt-4">
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>
        <ActionButton
          className="mt-4 w-full"
          onClick={() => startTemplate(challenge.id)}
        >
          Start challenge
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </ActionButton>
      </div>
    </article>
  )
}