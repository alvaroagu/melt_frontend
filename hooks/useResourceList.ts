"use client"

import { useEffect, useState } from "react"

type UseResourceListResult<T> = {
  data: T[]
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useResourceList<T>(fetcher: () => Promise<T[]>): UseResourceListResult<T> {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setIsLoading(true)
    setError(null)

    try {
      const nextData = await fetcher()
      setData(nextData)
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "No se pudo cargar la información."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      if (isMounted) {
        setIsLoading(true)
      }

      try {
        const nextData = await fetcher()

        if (!isMounted) {
          return
        }

        setData(nextData)
        setError(null)
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        const message =
          loadError instanceof Error ? loadError.message : "No se pudo cargar la información."
        setError(message)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [fetcher])

  return {
    data,
    isLoading,
    error,
    reload,
  }
}
