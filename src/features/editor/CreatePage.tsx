import { Scissors } from 'lucide-react'
import ComingSoon from '../../components/common/ComingSoon'

export default function CreatePage() {
  return (
    <ComingSoon
      icon={Scissors}
      title="Create"
      description="The interactive fabric editor with drag, rotate, resize, layers, and undo/redo is coming next."
      milestone={2}
    />
  )
}