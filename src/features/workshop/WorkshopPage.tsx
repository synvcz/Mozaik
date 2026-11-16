import CtaBanner from '../../components/workshop/CtaBanner'
import FeaturedChallenges from '../../components/workshop/FeaturedChallenges'
import Hero from '../../components/workshop/Hero'
import HowItWorks from '../../components/workshop/HowItWorks'
import PatternMarquee from '../../components/workshop/PatternMarquee'
import RecentCreations from '../../components/workshop/RecentCreations'

export default function WorkshopPage() {
  return (
    <>
      <Hero />
      <PatternMarquee />
      <HowItWorks />
      <FeaturedChallenges />
      <RecentCreations />
      <CtaBanner />
    </>
  )
}