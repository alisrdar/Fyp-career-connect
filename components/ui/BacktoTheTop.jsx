// components/BackToTopButton.jsx
"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"  // or any icon you like

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" })

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 opacity-50 outline-darkblue bg-primary dark:bg-muted text-white rounded-full shadow-lg transition-opacity"
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}
