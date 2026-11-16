import { Trophy } from 'lucide-react'
import ComingSoon from '../../components/common/ComingSoon'

export default function ChallengesPage() {
  return (
    <ComingSoon
      icon={Trophy}
      title="Challenges"
      description="Full flower challenges with creative objectives and visual guides for the editor."
      milestone={3}
    />
  )
}