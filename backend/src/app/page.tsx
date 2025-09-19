"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseServer"

export default function HomePage() {
  const [status, setStatus] = useState("Testing...")
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [type, setType] = useState<string | null>(null)

  useEffect(() => {
    // Parse URL fragments (hash parameters)
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const token = params.get('access_token')
    const resetType = params.get('type')
    
    setAccessToken(token)
    setType(resetType)
    console.log(token, resetType)

    async function test() {
      const { data, error } = await supabase.from("profiles").select("*").limit(1)
      if (error) {
        console.error("❌ Connection failed:", error.message)
        setStatus(`${token}+${resetType}`)
      } else {
        console.log("✅ Connection OK:", data)
        setStatus("✅ Connected, got " + data.length + " row(s)")
      }
    }
    test()
  }, [])

  return <h1>{status}</h1>
}
