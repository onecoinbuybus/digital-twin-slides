import { useState, useEffect } from 'react'
import Slides from './Slides'
import Roadmap from './Roadmap'

function getPage() {
  const hash = window.location.hash.replace('#', '')
  return hash === 'roadmap' ? 'roadmap' : 'slides'
}

export default function App() {
  const [page, setPage] = useState(getPage)

  useEffect(() => {
    const handler = () => setPage(getPage())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return (
    <>
      {/* Nav toggle */}
      <div style={{
        position: 'fixed', top: 12, right: 16, zIndex: 999,
        display: 'flex', gap: 4,
        background: '#00000066', backdropFilter: 'blur(12px)',
        borderRadius: 8, padding: 3, border: '1px solid #ffffff12',
      }}>
        {[
          { key: 'slides', label: 'Slides', hash: '' },
          { key: 'roadmap', label: 'Roadmap', hash: '#roadmap' },
        ].map(t => (
          <a key={t.key} href={t.hash || '#'} style={{
            padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            textDecoration: 'none', transition: 'all 0.2s',
            background: page === t.key ? '#818cf822' : 'transparent',
            color: page === t.key ? '#c4b5fd' : '#64748b',
            border: page === t.key ? '1px solid #818cf833' : '1px solid transparent',
          }}>{t.label}</a>
        ))}
      </div>
      {page === 'roadmap' ? <Roadmap /> : <Slides />}
    </>
  )
}
