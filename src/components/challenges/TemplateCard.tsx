import { ArrowRight, Target } from 'lucide-react'
import type { TemplateInfo } from '../../data/templates'
import { startTemplate } from '../../lib/editorActions'
import GuidePreview from '../artwork/GuidePreview'
import ActionButton from '../common/ActionButton'
import DifficultyBadge from '../common/DifficultyBadge'
import FlowerIllustration from '../workshop/FlowerIllustration'

export default function TemplateCard({ template }: { template: TemplateInfo }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-forest/10 bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div
        className="grid place-items-center p-6"
        style={{ backgroundColor: template.accent }}
      >
        {template.flowerId ? (
          <FlowerIllustration
            id={template.flowerId}
            className="h-36 w-36 transition-transform duration-700 ease-out group-hover:rotate-[24deg] group-hover:scale-110"
          />
        ) : (
          <GuidePreview
            guide={template.guide}
            className="h-36 w-36 transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold text-forest">{template.name}</h3>
        <p className="text-xs italic text-ink-soft">{template.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{template.description}</p>

        <p className="mt-4 flex gap-2 rounded-2xl bg-sage-soft/60 p-3 text-sm text-forest">
          <Target size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{template.objective}</span>
        </p>

        <div className="mt-4 flex flex-1 items-end justify-between gap-3">
          <DifficultyBadge difficulty={template.difficulty} />
        </div>
        <ActionButton
          variant="primary"
          className="mt-4 w-full"
          onClick={() => startTemplate(template.id)}
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