export function getClientInfo() {
  if (typeof window === 'undefined') {
    return {}
  }

  const userAgent = navigator.userAgent
  let deviceType = 'desktop'

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType = 'mobile'
  } else if (/Tablet|iPad/i.test(userAgent)) {
    deviceType = 'tablet'
  }

  return {
    userAgent,
    deviceType,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}

// Функция для получения IP адреса (требует бэкенд эндпоинт)
export async function getClientIP() {
  try {
    const response = await fetch('/api/auth/client-ip')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('Error getting IP:', error)
    return null
  }
}