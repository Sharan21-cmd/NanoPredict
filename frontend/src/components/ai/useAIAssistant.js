import { useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function useAIAssistant() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [response, setResponse] = useState(null)

  async function ask(question) {
    const trimmedQuestion = question.trim()

    if (!trimmedQuestion) {
      return null
    }

    setLoading(true)
    setError('')

    try {
      const token = sessionStorage.getItem('nanopredict_token')

      if (!token) {
        throw new Error('Authentication token not found')
      }

      const res = await fetch(
        `${API_BASE_URL}/api/ai/ask`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: trimmedQuestion,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.detail || 'AI assistant request failed'
        )
      }

      setResponse(data)
      return data
    } catch (err) {
      console.error('[NanoPredict] AI Assistant error:', err)
      setError(err.message || 'Unable to contact AI assistant')
      return null
    } finally {
      setLoading(false)
    }
  }

  function clearResponse() {
    setResponse(null)
    setError('')
  }

  return {
    ask,
    loading,
    error,
    response,
    clearResponse,
  }
}
