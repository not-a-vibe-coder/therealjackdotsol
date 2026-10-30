import { useEffect } from 'react'
import { ClosingTypography } from './components/ClosingTypography'
import { Footer } from './components/Footer'
import { Hero3D } from './components/Hero3D'
import { IntroTypography } from './components/IntroTypography'
import { JourneySection } from './components/JourneySection'
import { PlaygroundSection } from './components/PlaygroundSection'
import { ProjectGallery } from './components/ProjectGallery'
import { SectionIndex } from './components/SectionIndex'
import { ToolkitSection } from './components/ToolkitSection'
import { useLenis } from './hooks/useLenis'
import { ScrollTrigger } from './lib/motion'

export default function App() {
  useLenis()

  // Webfonts change line lengths and therefore every pinned measurement.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <a href="#manifesto" className="fixed left-4 top-4 z-[60] -translate-y-20 rounded bg-charcoal px-3 py-2 text-sm text-cream focus:translate-y-0">
        Skip to content
      </a>
      <SectionIndex />
      <main>
        <Hero3D />
        <IntroTypography />
        <JourneySection />
        <ToolkitSection />
        <ProjectGallery />
        <PlaygroundSection />
        <ClosingTypography />
      </main>
      <Footer />
    </>
  )
}
