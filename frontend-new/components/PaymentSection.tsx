interface PaymentSectionProps {
  price: number
  receiptFile: File | null
  setReceiptFile: (file: File | null) => void
  onConfirm: () => void
}

export default function PaymentSection({ price, receiptFile, setReceiptFile, onConfirm }: PaymentSectionProps) {
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiptFile(e.target.files?.[0] || null)
  }

  return (
    <div className="card payment-card visible">
      <div className="payment-section visible">
        <h3 className="card-title">Төлбөрийн заавар</h3>
        <p className="payment-amount-text">
          Та веб захиалгаа баталгаажуулахын тулд <strong>{price.toLocaleString()}₮</strong> дараах данс руу шилжүүлнэ үү.
        </p>
        <div className="bank-info">
          <p><strong>Банк:</strong> ХХБ</p>
          <p><strong>Дансны дугаар:</strong> 123456789</p>
          <p><strong>Хүлээн авагч:</strong> Бат-Эрдэнэ</p>
          <p><strong>Гүйлгээний утга:</strong> Таны нэр</p>
        </div>

        <div className="form-group">
          <label>Төлбөрийн баримт оруулах</label>
          <div className="file-upload" onClick={() => document.getElementById('receiptInput')?.click()}>
            <input
              type="file"
              id="receiptInput"
              accept="image/*"
              onChange={handleReceiptChange}
              style={{ display: 'none' }}
            />
            <span>Төлбөрийн баримт оруулах</span>
          </div>
          {receiptFile && (
            <div className="preview-grid">
              <div className="preview-item">
                <img src={URL.createObjectURL(receiptFile)} alt="Төлбөрийн баримт" />
                <button
                  type="button"
                  className="remove-preview"
                  onClick={() => setReceiptFile(null)}
                  aria-label="Устгах"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onConfirm}
          disabled={!receiptFile}
        >
          Баталгаажуулах →
        </button>
      </div>
    </div>
  )
}
