"use client"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [message, setMessage] = useState("Processing...")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1))
    const token = urlParams.get('access_token')
    
    if (token) {
      setMessage("✅ Email confirmed successfully!")
      setTimeout(() => {
        setMessage("You can now return to the app and sign in")
      }, 2000)
    } else {
      setMessage("❌ Invalid confirmation link")
    }
  }, [])

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
