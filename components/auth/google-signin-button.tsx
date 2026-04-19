'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export function GoogleSignInButton({ disabled }: { disabled?: boolean }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={disabled}
      onClick={() => signIn('google', { callbackUrl: '/' })}
    >
      Continue with Google
    </Button>
  )
}
