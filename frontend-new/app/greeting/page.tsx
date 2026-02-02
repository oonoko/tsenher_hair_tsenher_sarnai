'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import EmotionalReveal from '@/components/EmotionalReveal'
import GreetingContent from '@/components/GreetingContent'
import FloatingHearts from '@/components/FloatingHearts'
import MoodSwitch from '@/components/MoodSwitch'
import HiddenLoveNote from '@/components/HiddenLoveNote'

function GreetingPageContent() {
  const searchParams = useSearchParams()
  const [greetingData, setGreetingData] = useState<any>(null)
  const [showReveal, setShowReveal] = useState(false)
  const [nightMode, setNightMode] = useState(false)
  const [showEaster, setShowEaster] = useState(false)

  const tier = searchParams.get('tier') || 'standard'
  const name = searchParams.get('name') || 'Хайртай хүн'
  const id = searchParams.get('id')
  const message = searchParams.get('message')

  useEffect(() => {
    const fetchData = async () => {
      if (id && tier !== 'free') {
        try {
          const res = await axios.get(`/api/greeting/${id}`)
          setGreetingData(res.data)
        } catch (error) {
          console.error('Failed to fetch greeting data:', error)
        }
      }
    }
    fetchData()

    if (tier === 'premium') {
      setShowReveal(true)
    }
  }, [id, tier])

  const handleRevealOpen = () => {
    setShowReveal(false)
  }

  const isPremium = tier === 'premium'

  return (
    <div className={`greeting-page ${nightMode ? 'night-mode' : ''}`}>
      <FloatingHearts tier={tier} />
      
      {showReveal && isPremium && (
        <EmotionalReveal name={name} onOpen={handleRevealOpen} />
      )}

      {isPremium && (
        <>
          <MoodSwitch nightMode={nightMode} onToggle={() => setNightMode(!nightMode)} />
          <HiddenLoveNote onShow={() => setShowEaster(true)} />
        </>
      )}

      {showEaster && (
        <div className="easter-modal-overlay visible" onClick={() => setShowEaster(false)}>
          <div className="easter-modal" onClick={e => e.stopPropagation()}>
            <p>Та үүнийг оллоо. Би чамайг үнэхээр хайрладаг.</p>
            <button className="btn btn-primary" onClick={() => setShowEaster(false)}>
              Ойлголоо
            </button>
          </div>
        </div>
      )}

      <GreetingContent
        tier={tier}
        name={name}
        message={message}
        greetingData={greetingData}
        searchParams={searchParams}
      />
    </div>
  )
}

export default function GreetingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GreetingPageContent />
    </Suspense>
  )
}
