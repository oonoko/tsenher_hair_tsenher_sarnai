import { useState } from 'react'

interface EmotionalRevealProps {
  name: string
  onOpen: () => void
}

export default function EmotionalReveal({ name, onOpen }: EmotionalRevealProps) {
  const [burst, setBurst] = useState(false)

  const handleOpen = () => {
    setBurst(true)
    setTimeout(() => {
      onOpen()
    }, 600)
  }

  return (
    <div className="reveal-overlay" style={{ display: 'flex' }}>
      <div className="reveal-content">
        <p className="reveal-text">{name}, чамд бяцхан нууц хүлээж байна…</p>
        <button type="button" className="btn btn-primary btn-reveal" onClick={handleOpen}>
          💖 Нээх
        </button>
      </div>
      {burst && (
        <div className="heart-burst burst" style={{ display: 'block' }}>
          {['❤', '💕', '💗'].map((heart, i) => (
            <span
              key={i}
              className="burst-heart"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                fontSize: '48px',
                animation: `burstHeart 0.6s ease-out forwards`,
                animationDelay: `${i * 0.08}s`
              }}
            >
              {heart}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
