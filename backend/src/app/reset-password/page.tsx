"use client"
import { useEffect, useState } from "react"

export default function ResetPasswordPage() {
  const [message, setMessage] = useState("Processing...")
  const [token, setToken] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ password: "", confirm: "" })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = urlParams.get('access_token')
    const type = urlParams.get('type')
    
    if (accessToken && type === 'recovery') {
      setToken(accessToken)
      setShowForm(true)
      setMessage("Create your new password")
    } else {
      setMessage("❌ Access denied. Please use the reset link from your email.")
    }
  }, [])

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "Password must be at least 8 characters"
    if (!/(?=.*[a-z])/.test(pwd)) return "Password must contain lowercase letter"
    if (!/(?=.*[A-Z])/.test(pwd)) return "Password must contain uppercase letter"
    if (!/(?=.*\d)/.test(pwd)) return "Password must contain a number"
    return ""
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setErrors(prev => ({ ...prev, password: validatePassword(value) }))
  }

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value)
    setErrors(prev => ({ 
      ...prev, 
      confirm: value !== password ? "Passwords don't match" : "" 
    }))
  }

  const handleResetPassword = async () => {
    const passwordError = validatePassword(password)
    const confirmError = password !== confirmPassword ? "Passwords don't match" : ""
    
    setErrors({ password: passwordError, confirm: confirmError })
    
    if (passwordError || confirmError) return

    setLoading(true)
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          access_token: token, 
          new_password: password 
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage("✅ Password updated successfully!")
        setShowForm(false)
        setTimeout(() => {
          setMessage("You can now return to the app and sign in with your new password")
        }, 2000)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage("❌ Failed to update password")
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '450px',
        margin: '20px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            M
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 10px'
          }}>
            MedEstate
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: 0,
            lineHeight: '1.5'
          }}>
            {message}
          </p>
        </div>

        {showForm && (
          <div>
            {/* New Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: `2px solid ${errors.password ? '#e74c3c' : '#e1e8ed'}`,
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = errors.password ? '#e74c3c' : '#e1e8ed'}
              />
              {errors.password && (
                <p style={{
                  fontSize: '12px',
                  color: '#e74c3c',
                  margin: '5px 0 0',
                  fontWeight: '500'
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => handleConfirmChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: `2px solid ${errors.confirm ? '#e74c3c' : '#e1e8ed'}`,
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = errors.confirm ? '#e74c3c' : '#e1e8ed'}
              />
              {errors.confirm && (
                <p style={{
                  fontSize: '12px',
                  color: '#e74c3c',
                  margin: '5px 0 0',
                  fontWeight: '500'
                }}>
                  {errors.confirm}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleResetPassword}
              disabled={loading || !!errors.password || !!errors.confirm}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                background: loading || errors.password || errors.confirm 
                  ? '#bdc3c7' 
                  : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: loading || errors.password || errors.confirm ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                transform: loading ? 'none' : 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                if (!loading && !errors.password && !errors.confirm) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)'
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '10px'
                  }}></span>
                  Updating Password...
                </span>
              ) : (
                'Update Password'
              )}
            </button>

            {/* Password Requirements */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <p style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#495057',
                margin: '0 0 8px'
              }}>
                Password Requirements:
              </p>
              <ul style={{
                fontSize: '11px',
                color: '#6c757d',
                margin: 0,
                paddingLeft: '16px',
                lineHeight: '1.4'
              }}>
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
