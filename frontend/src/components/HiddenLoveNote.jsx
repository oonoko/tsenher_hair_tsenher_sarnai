import { useEffect, useRef } from 'react'

function HiddenLoveNote({ onShow }) {
  const buttonRef = useRef(null)

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.left = (10 + Math.random() * 80) + '%'
      buttonRef.current.style.top = (15 + Math.random() * 70) + '%'
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      type="button"
      className="hidden-love-note"
      onClick={onShow}
      aria-label="Нууц"
      style={{ display: 'block' }}
    >
      ✨
    </button>
  )
}

export default HiddenLoveNote
