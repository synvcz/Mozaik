import { X } from 'lucide-react'
import { useUiStore, type ToastTone } from '../../store/uiStore'

const TONES: Record<ToastTone, string> = {
  success: 'bg-forest text-ivory',
  error: 'bg-terracotta-deep text-white',
  info: 'bg-ink text-ivory',
}

export default function ToastHost() {
  const toasts = useUiStore((s) => s.toasts)
  const dismiss = useUiStore((s) => s.dismissToast)

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-page pointer-events-auto flex max-w-md items-center gap-3 rounded-full py-3 pl-5 pr-3 text-sm font-semibold shadow-xl ${TONES[t.tone]}`}
        >
          <span>{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss message"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-white/20"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}