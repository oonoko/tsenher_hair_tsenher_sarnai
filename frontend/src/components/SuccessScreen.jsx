import { useNavigate } from 'react-router-dom'

function SuccessScreen({ url, onNewOrder }) {
  const navigate = useNavigate()

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    alert('Холбоос хуулагдлаа!')
  }

  const handleOpenWeb = () => {
    const path = url.split(window.location.origin)[1]
    navigate(path)
  }

  return (
    <section className="success-screen visible">
      <div className="card">
        <div className="success-icon">❤</div>
        <h2>Таны веб бэлэн боллоо!</h2>
        <p className="success-url">{url}</p>
        <div className="success-buttons">
          <button className="btn btn-primary" onClick={handleOpenWeb}>
            Веб рүү орох
          </button>
          <button className="btn btn-secondary" onClick={handleCopy}>
            Хуваалцах
          </button>
          <button className="btn btn-ghost" onClick={onNewOrder}>
            Шинэ веб үүсгэх
          </button>
        </div>
      </div>
    </section>
  )
}

export default SuccessScreen
