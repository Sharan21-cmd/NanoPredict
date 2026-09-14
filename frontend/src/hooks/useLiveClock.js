import { useEffect, useState } from 'react'

export function useLiveClock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return time.toLocaleTimeString('en-GB', {
    hour12: false,
  })
}
