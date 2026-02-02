interface TierSelectionProps {
  selectedTier: string | null
  onSelect: (tier: string) => void
}

export default function TierSelection({ selectedTier, onSelect }: TierSelectionProps) {
  const tiers = [
    {
      id: 'free',
      badge: 'Үнэгүй',
      badgeClass: 'tier-badge-free',
      title: 'Урьдчилан харах',
      desc: 'Веб хэлбэр, мэдрэмжийг үнэгүй туршина',
      features: ['Системийн романтик мессеж', 'Хүлээн авагчийн нэр', 'Хязгаарлагдмал холбоос']
    },
    {
      id: 'standard',
      badge: '5,000₮',
      badgeClass: 'tier-badge-standard',
      title: 'Стандарт – Зургийн багц',
      desc: '1–5 зураг, богино мессеж',
      features: ['Хувийн веб, нэр', '1–5 хувийн зураг', 'Урьд бичсэн эсвэл богино мессеж']
    },
    {
      id: 'premium',
      badge: '20,000₮',
      badgeClass: 'tier-badge-premium',
      title: 'Премиум – Дээд туршлага',
      desc: 'Видео, дуу, урт мессеж',
      features: ['Стандартын бүх зүйл', 'Видео мессеж (MP4, 30–90 сек)', 'Романтик дуу, урт мессеж']
    }
  ]

  return (
    <section className="tier-section card">
      <h2 className="card-title">Загвараа сонгоно уу</h2>
      <div className="tier-cards">
        {tiers.map(tier => (
          <div
            key={tier.id}
            className={`tier-card ${selectedTier === tier.id ? 'selected' : ''}`}
            onClick={() => onSelect(tier.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(tier.id)
              }
            }}
          >
            <span className={`tier-badge ${tier.badgeClass}`}>{tier.badge}</span>
            <h3>{tier.title}</h3>
            <p>{tier.desc}</p>
            <ul className="tier-features">
              {tier.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
