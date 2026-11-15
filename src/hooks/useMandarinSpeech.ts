import { useCallback, useEffect, useRef, useState } from 'react'

export interface MandarinSpeech {
  readonly isSupported: boolean
  readonly voicesReady: boolean
  readonly hasChineseVoice: boolean
  readonly isSpeaking: boolean
  readonly error: string | null
  readonly speak: (text: string) => void
  readonly cancel: () => void
}

const pickChineseVoice = (
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null => {
  const chineseVoices = voices.filter((voice) =>
    /^zh([-_]|$)/i.test(voice.lang),
  )
  if (chineseVoices.length === 0) {
    return null
  }

  return (
    chineseVoices.find(
      (voice) =>
        voice.localService && /^zh[-_]CN$/i.test(voice.lang),
    ) ??
    chineseVoices.find((voice) => voice.localService) ??
    chineseVoices[0]
  )
}

export const useMandarinSpeech = (): MandarinSpeech => {
  const isSupported =
    typeof window !== 'undefined' &&
    Boolean(window.speechSynthesis) &&
    'SpeechSynthesisUtterance' in window
  const [voicesReady, setVoicesReady] = useState(false)
  const [hasChineseVoice, setHasChineseVoice] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (!isSupported) {
      return
    }

    const updateVoices = (): void => {
      const voice = pickChineseVoice(window.speechSynthesis.getVoices())
      voiceRef.current = voice
      setVoicesReady(true)
      setHasChineseVoice(voice !== null)
    }

    updateVoices()
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices)

    return () => {
      window.speechSynthesis.removeEventListener(
        'voiceschanged',
        updateVoices,
      )
      window.speechSynthesis.cancel()
    }
  }, [isSupported])

  const cancel = useCallback((): void => {
    requestIdRef.current += 1
    if (isSupported) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [isSupported])

  const speak = useCallback(
    (text: string): void => {
      if (!isSupported) {
        setError('当前浏览器不支持语音朗读。')
        return
      }
      if (!text) {
        return
      }

      requestIdRef.current += 1
      const requestId = requestIdRef.current
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.82
      utterance.pitch = 1
      if (voiceRef.current) {
        utterance.voice = voiceRef.current
      }

      utterance.onstart = (): void => {
        if (requestIdRef.current !== requestId) {
          return
        }
        setIsSpeaking(true)
        setError(null)
      }
      utterance.onend = (): void => {
        if (requestIdRef.current === requestId) {
          setIsSpeaking(false)
        }
      }
      utterance.onerror = (event): void => {
        if (requestIdRef.current !== requestId) {
          return
        }
        setIsSpeaking(false)
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          setError('朗读失败，请确认设备已安装中文语音。')
        }
      }

      window.speechSynthesis.speak(utterance)
    },
    [isSupported],
  )

  return {
    isSupported,
    voicesReady,
    hasChineseVoice,
    isSpeaking,
    error,
    speak,
    cancel,
  }
}
