'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Verify() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(600)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const phoneParam = searchParams.get('phone')
    if (phoneParam) {
      setPhone(decodeURIComponent(phoneParam))
    }
  }, [searchParams])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit code')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        phone,
        code: verificationCode,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid verification code')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Verify your phone</h2>
            <p className="mt-2 text-sm text-gray-600">Enter the 6-digit code sent to {phone}</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                6-digit verification code
              </label>
              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Time remaining: <span className="font-medium">{formatTime(timeLeft)}</span>
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>

            <div className="text-center">
              <Link 
                href="/auth/signin" 
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Use different phone number
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}