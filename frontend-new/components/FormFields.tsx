interface FormFieldsProps {
  tier: string
  formData: {
    recipientName: string
    senderName: string
    contact: string
    message: string
    messageShort: string
    messageType: string
    timeCapsule: string
  }
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  photoFiles: File[]
  setPhotoFiles: (files: File[]) => void
  videoFile: File | null
  setVideoFile: (file: File | null) => void
  musicFile: File | null
  setMusicFile: (file: File | null) => void
  voiceFile: File | null
  setVoiceFile: (file: File | null) => void
  onFreePreview: () => void
  onShowPayment: () => void
}

export default function FormFields({
  tier,
  formData,
  onInputChange,
  photoFiles,
  setPhotoFiles,
  videoFile,
  setVideoFile,
  musicFile,
  setMusicFile,
  voiceFile,
  setVoiceFile,
  onFreePreview,
  onShowPayment
}: FormFieldsProps) {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = 5 - photoFiles.length
    const toAdd = files.slice(0, remaining)
    setPhotoFiles([...photoFiles, ...toAdd].slice(0, 5))
  }

  const removePhoto = (index: number) => {
    setPhotoFiles(photoFiles.filter((_, i) => i !== index))
  }

  return (
    <section className="form-screen">
      <div className="card form-card">
        <h2 className="card-title">Захиалгын мэдээлэл</h2>
        
        <form>
          <div className="form-group">
            <label htmlFor="recipientName">Нэр</label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={onInputChange}
              placeholder="Хэнд зориулах вэ?"
              required
            />
          </div>

          {tier === 'free' && (
            <div className="form-group">
              <button type="button" className="btn btn-primary" onClick={onFreePreview}>
                Урьдчилан харах →
              </button>
              <p className="form-hint">Төлбөргүй. Зөвхөн загварыг харах боломжтой.</p>
            </div>
          )}

          {(tier === 'standard' || tier === 'premium') && (
            <div className="form-group">
              <label>Дурсамжийн зураг</label>
              <div className="file-upload" onClick={() => document.getElementById('photoInput')?.click()}>
                <input
                  type="file"
                  id="photoInput"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                <span>Зураг оруулах (1–5 зураг)</span>
              </div>
              <div className="preview-grid">
                {photoFiles.map((file, i) => (
                  <div key={i} className="preview-item">
                    <img src={URL.createObjectURL(file)} alt={`Preview ${i + 1}`} />
                    <button
                      type="button"
                      className="remove-preview"
                      onClick={() => removePhoto(i)}
                      aria-label="Устгах"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tier === 'standard' && (
            <div className="form-group">
              <label>Сэтгэлийн үг</label>
              <div className="message-option-row">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="messageType"
                    value="prewritten"
                    checked={formData.messageType === 'prewritten'}
                    onChange={onInputChange}
                  />
                  Урьд бичсэн романтик мессеж
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="messageType"
                    value="custom"
                    checked={formData.messageType === 'custom'}
                    onChange={onInputChange}
                  />
                  Богино өөрийн мессеж (200 тэмдэгт)
                </label>
              </div>
              {formData.messageType === 'custom' && (
                <>
                  <textarea
                    name="messageShort"
                    value={formData.messageShort}
                    onChange={onInputChange}
                    placeholder="Богино мессежээ бичээрэй…"
                    rows={3}
                    maxLength={200}
                  />
                  <span className="char-count">{formData.messageShort.length} / 200</span>
                </>
              )}
            </div>
          )}

          {tier === 'premium' && (
            <>
              <div className="form-group">
                <label htmlFor="message">Сэтгэлийн үг (урт мессеж)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={onInputChange}
                  placeholder="Сэтгэлээсээ бичээрэй…"
                  rows={6}
                />
              </div>

              <div className="form-group">
                <label>Видео мессеж</label>
                <div className="file-upload" onClick={() => document.getElementById('videoInput')?.click()}>
                  <input
                    type="file"
                    id="videoInput"
                    accept="video/mp4,.mp4"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                  <span>MP4 оруулах (30–90 секунд)</span>
                </div>
                {videoFile && <p className="form-hint">Видео: {videoFile.name}</p>}
              </div>

              <div className="form-group">
                <label>Романтик дуу (нээлттэй тоглуулах)</label>
                <div className="file-upload" onClick={() => document.getElementById('musicInput')?.click()}>
                  <input
                    type="file"
                    id="musicInput"
                    accept="audio/mpeg,audio/mp3,.mp3"
                    onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                  <span>Дуу оруулах (MP3)</span>
                </div>
                {musicFile && <p className="form-hint">Дуу: {musicFile.name}</p>}
              </div>
            </>
          )}

          {tier !== 'free' && (
            <>
              <div className="form-group">
                <label htmlFor="senderName">Илгээгчийн нэр</label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={formData.senderName}
                  onChange={onInputChange}
                  placeholder="Таны нэр (With love, …)"
                />
              </div>

              {tier === 'premium' && (
                <>
                  <div className="form-group">
                    <label>Дуу мессеж (10–20 секунд)</label>
                    <div className="file-upload" onClick={() => document.getElementById('voiceInput')?.click()}>
                      <input
                        type="file"
                        id="voiceInput"
                        accept="audio/mpeg,audio/mp3,.mp3"
                        onChange={(e) => setVoiceFile(e.target.files?.[0] || null)}
                        style={{ display: 'none' }}
                      />
                      <span>Дуу мессеж оруулах</span>
                    </div>
                    {voiceFile && <p className="form-hint">Дуу: {voiceFile.name}</p>}
                  </div>

                  <div className="form-group">
                    <label>Цаг хугацааны капсул</label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="timeCapsule"
                        value="none"
                        checked={formData.timeCapsule === 'none'}
                        onChange={onInputChange}
                      />
                      Байхгүй
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="timeCapsule"
                        value="6months"
                        checked={formData.timeCapsule === '6months'}
                        onChange={onInputChange}
                      />
                      6 сарын дараа нээх
                    </label>
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="contact">Холбоо барих</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={onInputChange}
                  placeholder="Таны утас / И-мэйл"
                  required
                />
              </div>

              <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={onShowPayment}>
                  Төлбөрийн заавар харах →
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
