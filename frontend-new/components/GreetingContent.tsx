interface GreetingContentProps {
  tier: string
  name: string
  message: string | null
  greetingData: any
  searchParams: URLSearchParams
}

export default function GreetingContent({ tier, name, message, greetingData }: GreetingContentProps) {
  const defaultMessage = 'Чамайг харах бүрт миний ертөнц илүү гэрэлтдэг. Энэ бяцхан вебийг тусгайлан чамдаа зориуланхийлгэлээ. Хайртай шүү ❤'
  const freeMessage = 'Чамайг харах бүрт миний ертөнц илүү гэрэлтдэг. Энэ бяцхан мэндчилгээг чамдаа зориуллаа. Хайртай шүү ❤'
  
  const displayMessage = tier === 'free' ? freeMessage : message || greetingData?.message || defaultMessage
  const senderName = greetingData?.senderName || ''
  const photos = greetingData?.photos || []
  const voice = greetingData?.voice
  const video = greetingData?.video
  const music = greetingData?.music
  const timeCapsule = greetingData?.timeCapsule

  const getTimeCapsuleDate = () => {
    const d = new Date()
    d.setMonth(d.getMonth() + 6)
    return d.toLocaleDateString('mn-MN')
  }

  return (
    <main className="greeting-main" style={{ opacity: 1, pointerEvents: 'auto' }}>
      <header className="greeting-header">
        <h1>{tier === 'free' ? 'Зүрхнээс ирсэн бэлэг' : 'Сэтгэлийн илгээмж'}</h1>
      </header>

      <section className="greeting-recipient">
        <h2>{name}</h2>
        <p className="sub">чамдаа зориуллаа…</p>
      </section>

      <div className="greeting-message-box">
        <p className="message-text">{displayMessage}</p>
      </div>

      {tier !== 'free' && photos.length > 0 && (
        <section className="greeting-photos">
          <h3>Бидний дурсамжууд</h3>
          <div className="photos-grid">
            {photos.map((src: string, i: number) => (
              <div key={i} className="photo-frame">
                <img src={src} alt={`Дурсамж ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {tier === 'premium' && video && (
        <section className="greeting-video" style={{ display: 'block' }}>
          <h3>Видео мессеж</h3>
          <div className="video-wrapper">
            <video controls playsInline preload="metadata">
              <source src={video} type="video/mp4" />
            </video>
          </div>
        </section>
      )}

      {tier === 'premium' && voice && (
        <section className="greeting-voice" style={{ display: 'block' }}>
          <h3>Дуу мессеж</h3>
          <div className="voice-wrapper">
            <audio preload="auto">
              <source src={voice} type="audio/mpeg" />
            </audio>
            <button type="button" className="btn btn-primary btn-voice-play">
              ▶ Тоглуулах
            </button>
          </div>
        </section>
      )}

      {tier === 'premium' && music && (
        <section className="greeting-music" style={{ display: 'block' }}>
          <div className="audio-wrapper">
            <audio loop preload="auto" muted>
              <source src={music} type="audio/mpeg" />
            </audio>
            <button type="button" className="btn btn-secondary btn-mute-toggle">
              🔇 Дуу асах
            </button>
          </div>
        </section>
      )}

      {tier === 'premium' && timeCapsule === '6months' && (
        <section className="greeting-timecapsule" style={{ display: 'block' }}>
          <div className="timecapsule-box">
            <p>Энэ мессеж <strong>6 сарын дараа</strong> нээгдэнэ.</p>
            <p className="timecapsule-date">{getTimeCapsuleDate()}</p>
          </div>
        </section>
      )}

      {tier === 'free' && (
        <div className="greeting-payment-box">
          <h4>Төлбөрийн заавар</h4>
          <p>Веб үүсгэхийн тулд <strong>5,000₮</strong> эсвэл <strong>20,000₮</strong> энэ данс руу шилжүүлнэ үү.</p>
          <div className="bank-info" style={{ marginTop: '0.75rem' }}>
            <p><strong>Банк:</strong> ХХБ</p>
            <p><strong>Дансны дугаар:</strong> 123456789</p>
            <p><strong>Хүлээн авагч:</strong> Бат-Эрдэнэ</p>
            <p><strong>Гүйлгээний утга:</strong> Таны нэр</p>
          </div>
        </div>
      )}

      <div className="greeting-buttons">
        <button type="button" className="btn btn-primary">Баярлалаа</button>
        <button type="button" className="btn btn-secondary">Хайр илгээх</button>
        <button type="button" className="btn btn-secondary">Дурсамж үзэх</button>
      </div>

      <footer className="greeting-ending">
        <p className="ending-text">Энэ нь зөвхөн эхлэл…</p>
        <p className="ending-signature">
          {senderName ? `Хайртайгаар, ${senderName}` : 'Хайртайгаар,'}
        </p>
        <p><span className="heart-icon">❤</span></p>
      </footer>
    </main>
  )
}
