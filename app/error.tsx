'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ padding: '20px', background: '#fff', color: '#000', minHeight: '100vh' }}>
      <h2>Opa! Algo deu errado no Dashboard.</h2>
      <p style={{ color: 'red', fontWeight: 'bold' }}>{error.message}</p>
      <button onClick={() => reset()} style={{ padding: '10px', marginTop: '10px' }}>
        Tentar novamente
      </button>
      <pre style={{ marginTop: '20px', fontSize: '12px', background: '#f4f4f4', padding: '10px' }}>
        {error.stack}
      </pre>
    </div>
  )
}
