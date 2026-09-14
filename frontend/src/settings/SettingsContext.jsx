import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('nanopredict-settings')

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // Fall back to defaults
      }
    }

    return {
      theme: 'dark',
      showGrid: true,
      showSensorIndicators: true,
    }
  })

  useEffect(() => {
    localStorage.setItem(
      'nanopredict-settings',
      JSON.stringify(settings)
    )

    document.documentElement.classList.toggle(
      'light',
      settings.theme === 'light'
    )
  }, [settings])

  function setTheme(theme) {
    setSettings((previous) => ({
      ...previous,
      theme,
    }))
  }

  function setShowGrid(value) {
    setSettings((previous) => ({
      ...previous,
      showGrid: value,
    }))
  }

  function setShowSensorIndicators(value) {
    setSettings((previous) => ({
      ...previous,
      showSensorIndicators: value,
    }))
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTheme,
        setShowGrid,
        setShowSensorIndicators,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error(
      'useSettings must be used inside SettingsProvider'
    )
  }

  return context
}
