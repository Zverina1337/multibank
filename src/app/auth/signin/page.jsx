'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getClientInfo, getClientIP } from '../../lib/clientInfo'

export default function SignIn() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clientData, setClientData] = useState({})
  const router = useRouter()

  useEffect(() => {
    // Собираем клиентские данные при загрузке компонента
    const gatherClientData = async () => {
      const info = getClientInfo()
      const ip = await getClientIP()
      setClientData({ ...info, ip })
    }
    
    gatherClientData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone,
          ipAddress: clientData.ip,
          userAgent: clientData.userAgent,
          deviceType: clientData.deviceType,
          location: clientData.timezone
        })
      })

      const data = await res.json()

      if (res.ok) {
        router.push(`/auth/verify?phone=${encodeURIComponent(phone)}`)
      } else {
        setError(data.message || 'Failed to send code')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to MultiBank</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your phone number to sign in</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="+1 (555) 123-4567"
                pattern="^\+?[\d\s\-\(\)]{10,}$"
              />
              <p className="mt-1 text-xs text-gray-500">Enter your phone number with country code</p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </div>

        <div className="text-center text-xs text-gray-500">
          © 2024 MultiBank. All rights reserved.
        </div>
      </div>
    </div>
  )
}