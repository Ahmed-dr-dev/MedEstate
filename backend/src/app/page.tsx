"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [message, setMessage] = useState("Processing...")

  useEffect(() => {
    // Parse URL fragments (hash parameters)
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const token = params.get('access_token')
    const type = params.get('type')
    
    console.log('Token:', token, 'Type:', type)

    // If this is an email confirmation or password reset callback
    if (token && (type === 'signup' || type === 'recovery')) {
      // Store token via API for mobile app access
      fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, type })
      }).then(response => response.json())
        .then(data => {
          if (data.success) {
            if (type === 'signup') {
              setMessage("✅ Email confirmed successfully!")
              setTimeout(() => {
                router.push('/resetPassword')
              }, 2000)
            } else if (type === 'recovery') {
              setMessage("Redirecting to reset password...")
              // Redirect to mobile app with token
              window.location.href = `exp://192.168.1.160:8081/--/Screens/reset-password?access_token=${token}`
            }
          } else {
            setMessage("Failed to process token")
          }
        })
        .catch(error => {
          console.error('Token storage error:', error)
          setMessage("Failed to process token")
        })
    } else {
      // Default behavior
      setMessage("Invalid link or missing parameters")
    }
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>{message}</h1>
    </div>
  )
}
