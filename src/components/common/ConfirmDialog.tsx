import ActionButton from './ActionButton'
import Modal from './Modal'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <p className="leading-relaxed text-ink-soft">{message}</p>
      <div className="mt-7 flex justify-end gap-3">
        <ActionButton onClick={onCancel}>Cancel</ActionButton>
        <ActionButton variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </ActionButton>
      </div>
    </Modal>
  )
}