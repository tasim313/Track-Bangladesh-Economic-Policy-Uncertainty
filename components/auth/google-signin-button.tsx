'use client'

import { Button } from '@/components/ui/button'

export function GoogleSignInButton({ disabled }: { disabled?: boolean }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled
      onClick={() => undefined}
    >
      Google Sign-in disabled
    </Button>
  )
}
