import { ALL_TEMPLATES } from '../../data/templates'
import { useEditorStore } from '../../store/editorStore'
import GuidePreview from '../artwork/GuidePreview'
import Panel from './Panel'

export default function TemplatePicker() {
  const templateId = useEditorStore((s) => s.templateId)
  const setTemplate = useEditorStore((s) => s.setTemplate)

  return (
    <Panel title="Outline templates">
      <p className="mb-3 text-xs text-ink-soft">
        A dashed outline appears behind your pieces as a guide. It is never part of the artwork.
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        <button
          type="button"
          aria-pressed={templateId === null}
          onClick={() => setTemplate(null)}
          className={`flex aspect-square flex-col items-center justify-center rounded-2xl border text-[11px] font-semibold transition ${
            templateId === null
              ? 'border-forest bg-sage-soft text-forest'
              : 'border-forest/15 text-ink-soft hover:bg-ivory-deep'
          }`}
        >
          Blank
        </button>
        {ALL_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.name}
            aria-label={`${t.name} outline`}
            aria-pressed={templateId === t.id}
            onClick={() => setTemplate(t.id)}
            className={`flex aspect-square flex-col items-center justify-between rounded-2xl border p-1.5 transition ${
              templateId === t.id
                ? 'border-forest bg-sage-soft'
                : 'border-forest/15 hover:bg-ivory-deep'
            }`}
          >
            <GuidePreview guide={t.guide} className="h-full min-h-0 w-full flex-1" />
            <span className="mt-1 w-full truncate text-center text-[10px] font-semibold text-forest">
              {t.name}
            </span>
          </button>
        ))}
      </div>
    </Panel>
  )
}