import { Images } from 'lucide-react'
import ComingSoon from '../../components/common/ComingSoon'

export default function GaleriPage() {
  return (
    <ComingSoon
      icon={Images}
      title="Galeri"
      description="Browse community artwork, like your favorites, and publish your own."
      milestone={4}
    />
  )
}