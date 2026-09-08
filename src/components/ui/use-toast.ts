import { useState } from "react"

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([])
  return {
    toast: (t: any) => setToasts([...toasts, t]),
    toasts
  }
}
