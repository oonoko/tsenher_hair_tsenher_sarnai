'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import TierSelection from '@/components/TierSelection'
import FormFields from '@/components/FormFields'
import PaymentSection from '@/components/PaymentSection'
import SuccessScreen from '@/components/SuccessScreen'
import LoadingOverlay from '@/components/LoadingOverlay'

const STANDARD_PRICE = 5000
const PREMIUM_PRICE = 20000

export default function OrderForm() {
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    recipientName: '',
    senderName: '',
    contact: '',
    message: '',
    messageShort: '',
    messageType: 'prewritten',
    timeCapsule: 'none'
  })
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [musicFile, setMusicFile] = useState<File | null>(null)
  const [voiceFile, setVoiceFile] = useState<File | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier)
    setShowPayment(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFreePreview = () => {
    if (!formData.recipientName.trim()) return
    const params = new URLSearchParams({
      tier: 'free',
      name: formData.recipientName
    })
    router.push(`/greeting?${params.toString()}`)
  }

  const handleShowPayment = () => {
    if (!formData.recipientName.trim() || !formData.contact.trim()) return
    setShowPayment(true)
  }

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleConfirmPayment = async () => {
    if (!receiptFile) return
    
    setLoading(true)
    const id = Math.random().toString(36).slice(2, 10)
    
    try {
      const photos = photoFiles.length ? await Promise.all(
        photoFiles.slice(0, 5).map(f => fileToDataUrl(f))
      ) : []
      
      const voice = voiceFile ? await fileToDataUrl(voiceFile) : ''
      const video = videoFile ? await fileToDataUrl(videoFile) : ''
      const music = musicFile ? await fileToDataUrl(musicFile) : ''

      const message = selectedTier === 'standard' 
        ? (formData.messageType === 'custom' ? formData.messageShort : '')
        : formData.message

      await axios.post('/api/greeting', {
        id,
        name: formData.recipientName,
        message,
        tier: selectedTier,
        senderName: formData.senderName,
        photos,
        voice,
        video,
        music,
        timeCapsule: formData.timeCapsule === '6months' ? '6months' : ''
      })

      const params = new URLSearchParams({
        name: formData.recipientName,
        tier: selectedTier!,
        id,
        message: message.length < 800 ? message : ''
      })

      const url = `/greeting?${params.toString()}`
      setGeneratedUrl(window.location.origin + url)
      
      setTimeout(() => {
        setLoading(false)
        setShowSuccess(true)
      }, 2500)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
      alert('Алдаа гарлаа. Дахин оролдоно уу.')
    }
  }

  const handleNewOrder = () => {
    setShowSuccess(false)
    setSelectedTier(null)
    setFormData({
      recipientName: '',
      senderName: '',
      contact: '',
      message: '',
      messageShort: '',
      messageType: 'prewritten',
      timeCapsule: 'none'
    })
    setPhotoFiles([])
    setVideoFile(null)
    setMusicFile(null)
    setVoiceFile(null)
    setReceiptFile(null)
    setShowPayment(false)
  }

  const getPrice = () => {
    if (selectedTier === 'premium') return PREMIUM_PRICE
    return STANDARD_PRICE
  }

  if (showSuccess) {
    return <SuccessScreen url={generatedUrl} onNewOrder={handleNewOrder} />
  }

  return (
    <>
      <div className="page-header">
        <h1>Тусгай веб бүтээх захиалга</h1>
        <p>Хайртай хүндээ зориулсан вебээ үүсгээрэй</p>
      </div>

      <main className="container">
        <TierSelection 
          selectedTier={selectedTier}
          onSelect={handleTierSelect}
        />

        {selectedTier && (
          <FormFields
            tier={selectedTier}
            formData={formData}
            onInputChange={handleInputChange}
            photoFiles={photoFiles}
            setPhotoFiles={setPhotoFiles}
            videoFile={videoFile}
            setVideoFile={setVideoFile}
            musicFile={musicFile}
            setMusicFile={setMusicFile}
            voiceFile={voiceFile}
            setVoiceFile={setVoiceFile}
            onFreePreview={handleFreePreview}
            onShowPayment={handleShowPayment}
          />
        )}

        {showPayment && selectedTier !== 'free' && (
          <PaymentSection
            price={getPrice()}
            receiptFile={receiptFile}
            setReceiptFile={setReceiptFile}
            onConfirm={handleConfirmPayment}
          />
        )}
      </main>

      {loading && <LoadingOverlay />}
    </>
  )
}
