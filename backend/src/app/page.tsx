"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseServer"

export default function HomePage() {
  const [status, setStatus] = useState("Testing...")

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase.from("profiles").select("*").limit(1)
      if (error) {
        console.error("❌ Connection failed:", error.message)
        setStatus("❌ Failed: " + error.message)
      } else {
        console.log("✅ Connection OK:", data)
        setStatus("✅ Connected, got " + data.length + " row(s)")
      }
    }
    test()
  }, [])

  return <h1>{status}</h1>
}
