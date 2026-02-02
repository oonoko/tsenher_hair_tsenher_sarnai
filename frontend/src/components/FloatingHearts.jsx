import { useEffect, useRef } from 'react'

function FloatingHearts({ tier }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const count = tier === 'premium' ? 12 : tier === 'free' ? 5 : 8
    const hearts = ['❤', '💕', '💗']

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span')
      span.className = 'heart-float' + (tier === 'premium' ? ' heart-glow' : '')
      span.textContent = hearts[i % hearts.length]
      span.style.left = Math.random() * 100 + '%'
      span.style.animationDelay = Math.random() * 5 + 's'
      span.style.animationDuration = (6 + Math.random() * 4) + 's'
      containerRef.current.appendChild(span)
    }
  }, [tier])

  return <div className="hearts-bg" ref={containerRef} aria-hidden="true"></div>
}

export default FloatingHearts
