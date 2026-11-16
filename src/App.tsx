
import { useState } from 'react'
import {
  ArrowRight,
  Flower2,
  Layers3,
  Palette,
  Sparkles,
} from 'lucide-react'
import './App.css'

function App() {
  const [started, setStarted] = useState(false)

  return (
    <main className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon">
            <Layers3 size={21} />
          </span>
          <span>Mozaik Kain Perca</span>
        </a>

        <span className="nav-label">KREASI KAIN PERCA</span>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            <Sparkles size={15} />
            SENI DALAM SETIAP POTONGAN
          </span>

          <h1>
            Setiap potongan
            <br />
            punya <span>cerita.</span>
          </h1>

          <p className="description">
            Jelajahi keindahan kain tradisional Indonesia.
            Susun potongan warna, motif, dan imajinasimu
            menjadi sebuah karya yang unik.
          </p>

          <button
            className="primary-button"
            onClick={() => setStarted(true)}
          >
            {started ? 'Workshop segera hadir' : 'Mulai Berkarya'}
            <ArrowRight size={18} />
          </button>

          <div className="hero-note">
            <Flower2 size={17} />
            Bebaskan kreativitasmu, satu potongan demi satu.
          </div>
        </div>

        <div className="artwork">
          <div className="artwork-card">
            <div className="fabric fabric-one" />
            <div className="fabric fabric-two" />
            <div className="fabric fabric-three" />
            <div className="fabric fabric-four" />
            <div className="fabric fabric-five" />
            <div className="fabric fabric-six" />
            <div className="fabric fabric-seven" />
            <div className="artwork-caption">
              <span>01 / INSPIRASI</span>
              <span>Ragam Motif</span>
            </div>
          </div>
          <div className="floating-note">
            <Palette size={18} />
            <span>Kreasikan duniamu</span>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <span className="feature-icon"><Palette /></span>
          <div>
            <h3>Pilih Warna</h3>
            <p>Padukan warna sesuai imajinasimu.</p>
          </div>
        </div>

        <div className="feature">
          <span className="feature-icon"><Layers3 /></span>
          <div>
            <h3>Susun Potongan</h3>
            <p>Rangkai kain menjadi sebuah karya.</p>
          </div>
        </div>

        <div className="feature">
          <span className="feature-icon"><Sparkles /></span>
          <div>
            <h3>Ciptakan Karya</h3>
            <p>Jadikan setiap susunan bermakna.</p>
          </div>
        </div>
      </section>

      <footer>
        <span>MOZAIK KAIN PERCA</span>
        <span>Dibuat dengan kreativitas.</span>
      </footer>
    </main>
  )
}

export default App
