// hooks/useMascotState.ts
'use client'
import { useRef, useState, useCallback, useEffect } from 'react'

type MascotState = 'idle' | 'thinking' | 'happy' | 'sad' | 'neutral' | 'celebrate' | 'sleepy'
type Result = 'correct' | 'wrong' | 'neutral'
type Event =
  | { type: 'ANSWER_START' }
  | { type: 'ANSWER_RESULT'; payload: { result: Result; stageCrossed?: boolean } }
  | { type: 'STAGE_COMPLETE' }
  | { type: 'BADGE_EARNED' }
  | { type: 'FORCE_IDLE' }

export type { MascotState, Result }

export default function useMascotState() {
  const [state, setState] = useState<MascotState>('idle')
  const queueRef = useRef<Event[]>([])
  const busyRef = useRef(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const runQueue = useCallback(async () => {
    busyRef.current = true
    while (queueRef.current.length > 0) {
      const ev = queueRef.current.shift()!
      if (ev.type === 'ANSWER_START') {
        clearTimer()
        setState('thinking')
        // ensure minimum thinking time
        await new Promise((r) => setTimeout(r, 320))
      } else if (ev.type === 'ANSWER_RESULT') {
        const r = ev.payload.result
        if (r === 'correct') {
          setState('happy')
          // keep visible for 700ms
          await new Promise((r2) => { timerRef.current = window.setTimeout(r2, 700) })
        } else if (r === 'wrong') {
          setState('sad')
          await new Promise((r2) => { timerRef.current = window.setTimeout(r2, 900) })
        } else {
          setState('neutral')
          await new Promise((r2) => { timerRef.current = window.setTimeout(r2, 600) })
        }
        clearTimer()
        // optionally handle stageCrossed (emit celebrate event)
        if (ev.payload.stageCrossed) {
          // Immediately show celebrate after answer result
          setState('celebrate')
          await new Promise((r2) => { timerRef.current = window.setTimeout(r2, 1200) })
          clearTimer()
        }
        setState('idle')
      } else if (ev.type === 'STAGE_COMPLETE' || ev.type === 'BADGE_EARNED') {
        setState('celebrate')
        await new Promise((r) => { timerRef.current = window.setTimeout(r, 1200) })
        clearTimer()
        setState('idle')
      } else if (ev.type === 'FORCE_IDLE') {
        clearTimer()
        setState('idle')
      }
    }
    busyRef.current = false
  }, [clearTimer])

  const enqueue = useCallback((ev: Event) => {
    queueRef.current.push(ev)
    if (!busyRef.current) {
      runQueue()
    }
  }, [runQueue])

  // public API
  const onAnswerStart = useCallback(() => enqueue({ type: 'ANSWER_START' }), [enqueue])
  const onAnswerResult = useCallback((result: Result, stageCrossed = false) => enqueue({ type: 'ANSWER_RESULT', payload: { result, stageCrossed } }), [enqueue])
  const onStageComplete = useCallback(() => enqueue({ type: 'STAGE_COMPLETE' }), [enqueue])
  const onBadgeEarned = useCallback(() => enqueue({ type: 'BADGE_EARNED' }), [enqueue])
  const forceIdle = useCallback(() => enqueue({ type: 'FORCE_IDLE' }), [enqueue])

  useEffect(() => {
    return () => {
      clearTimer()
      queueRef.current = []
    }
  }, [clearTimer])

  return { state, onAnswerStart, onAnswerResult, onStageComplete, onBadgeEarned, forceIdle }
}
