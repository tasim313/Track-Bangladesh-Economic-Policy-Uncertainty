'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, LockKeyhole, Mail } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth-store'

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

type FormValues = z.infer<typeof schema>

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading sign-in form...</div>}>
      <SignInContent />
    </Suspense>
  )
}

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/v1/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.email,
        username: values.email,
        password: values.password,
      }),
    })

    const payload = (await response.json().catch(() => ({}))) as {
      access?: string
      refresh?: string
      detail?: string
      message?: string
      expires_in?: number
      access_expires_in?: number
      user?: { id?: string; email?: string; name?: string; full_name?: string }
    }

    if (!response.ok || !payload.access) {
      toast.error(payload.detail ?? payload.message ?? 'Invalid email or password.')
      return
    }

    const expiresIn = Number(payload.expires_in ?? payload.access_expires_in ?? 1800)
    setAuth({
      accessToken: payload.access,
      refreshToken: payload.refresh,
      accessTokenExpires: Date.now() + expiresIn * 1000,
      user: payload.user
        ? {
            id: payload.user.id,
            email: payload.user.email ?? values.email,
            name: payload.user.name,
            fullName: payload.user.full_name,
          }
        : {
            email: values.email,
            name: values.email.split('@')[0],
            fullName: values.email.split('@')[0],
          },
    })

    toast.success('Signed in successfully.')
    router.push(callbackUrl)
  })

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in with your backend credentials to reach the protected research dashboard."
      footer={
        <p className="text-sm text-muted-foreground">
          New here?{' '}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form className="space-y-5" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} type="email" className="pl-9" placeholder="researcher@example.com" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link href="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} type="password" className="pl-9" placeholder="Enter your password" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Sign in'}
          </Button>
        </form>
      </Form>

    </AuthShell>
  )
}
