'use client'
import { useEffect, useState } from 'react'

export function CountdownTimer({ until }: { until: number }) {
              const [timeLeft, setTimeLeft] = useState(until - Date.now())
              useEffect(() => {
                            const interval = setInterval(() => {
                                          setTimeLeft(until - Date.now())
                            }, 1000)
                            return () => clearInterval(interval)
              }, [until])

              if (timeLeft <= 0) return null

              const
}