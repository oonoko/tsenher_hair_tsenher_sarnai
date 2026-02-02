interface MoodSwitchProps {
  nightMode: boolean
  onToggle: () => void
}

export default function MoodSwitch({ nightMode, onToggle }: MoodSwitchProps) {
  return (
    <button
      type="button"
      className="mood-switch"
      onClick={onToggle}
      aria-label="Өдөр/Шөнийн горим"
      style={{ display: 'flex' }}
    >
      <span className="mood-icon-day" style={{ display: nightMode ? 'none' : 'inline' }}>
        🌸
      </span>
      <span className="mood-icon-night" style={{ display: nightMode ? 'inline' : 'none' }}>
        🌙
      </span>
    </button>
  )
}
