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
  return (
    <div style={{
      position: 'fixed', top: 12, right: 16, zIndex: 9999,
      display: 'flex', gap: 4,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
      borderRadius: 8, padding: 3, border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} style={{
        padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600,
        textDecoration: 'none', cursor: 'pointer',
        background: page === 'slides' ? 'rgba(129,140,248,0.13)' : 'transparent',
        color: page === 'slides' ? '#c4b5fd' : '#64748b',
        border: page === 'slides' ? '1px solid rgba(129,140,248,0.2)' : '1px solid transparent',
      }}>Slides</a>
      <a href="#roadmap" onClick={(e) => { e.preventDefault(); window.location.hash = 'roadmap'; }} style={{
        padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600,
        textDecoration: 'none', cursor: 'pointer',
        background: page === 'roadmap' ? 'rgba(129,140,248,0.13)' : 'transparent',
        color: page === 'roadmap' ? '#c4b5fd' : '#64748b',
        border: page === 'roadmap' ? '1px solid rgba(129,140,248,0.2)' : '1px solid transparent',
      }}>Roadmap</a>
    </div>
  )
}
