import { useState, useEffect } from 'react'
import Slides from './Slides'
import Roadmap from './Roadmap'

function getPage() {
  return window.location.hash === '#roadmap' ? 'roadmap' : 'slides'
}

export default function App() {
  const [page, setPage] = useState(() => getPage())

  useEffect(() => {
    const handler = () => setPage(getPage())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (page === 'roadmap') {
    return (
      <>
        <NavToggle page={page} />
        <Roadmap />
      </>
    )
  }

  return (
    <>
      <NavToggle page={page} />
      <Slides />
    </>
  )
}

function NavToggle({ page }) {
  const navigate = (hash) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.hash = hash
  }

  return (
    <div style={{
      position: 'fixed', top: 14, right: 20, zIndex: 99999,
      display: 'flex', gap: 6,
      background: 'rgba(15,15,25,0.92)', backdropFilter: 'blur(16px)',
      borderRadius: 10, padding: 5,
      border: '1px solid rgba(129,140,248,0.25)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      <button onClick={navigate('')} style={{
        padding: '7px 18px', borderRadius: 7, fontSize: 13, fontWeight: 700,
        cursor: 'pointer', border: 'none', fontFamily: 'Inter, system-ui, sans-serif',
        background: page === 'slides' ? 'rgba(129,140,248,0.25)' : 'transparent',
        color: page === 'slides' ? '#e0e7ff' : '#94a3b8',
      }}>Slides</button>
      <button onClick={navigate('roadmap')} style={{
        padding: '7px 18px', borderRadius: 7, fontSize: 13, fontWeight: 700,
        cursor: 'pointer', border: 'none', fontFamily: 'Inter, system-ui, sans-serif',
        background: page === 'roadmap' ? 'rgba(110,231,183,0.2)' : 'transparent',
        color: page === 'roadmap' ? '#6ee7b7' : '#94a3b8',
      }}>Roadmap</button>
    </div>
  )
}
