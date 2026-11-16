import { Bookmark } from 'lucide-react'
import ComingSoon from '../../components/common/ComingSoon'

export default function CollectionPage() {
  return (
    <ComingSoon
      icon={Bookmark}
      title="My Collection"
      description="Everything you create in this session, ready to preview or keep editing."
      milestone={5}
    />
  )
}