'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth-store'

const schema = z
  .object({
    fullName: z.string().min(2, 'Full name is required.'),
    email: z.string().email('Enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function SignUpPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = form.handleSubmit(async ({ confirmPassword: _confirmPassword, ...values }) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const payload = (await response.json().catch(() => ({}))) as { message?: string }

    if (!response.ok) {
      toast.error(payload.message ?? 'Registration failed.')
      return
    }

    toast.success('Account created successfully.')
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
    const loginResponse = await fetch(`${apiUrl.replace(/\/$/, '')}/api/v1/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.email,
        username: values.email,
        password: values.password,
      }),
    })
    const loginPayload = (await loginResponse.json().catch(() => ({}))) as {
      access?: string
      refresh?: string
      expires_in?: number
      access_expires_in?: number
      user?: { id?: string; email?: string; name?: string; full_name?: string }
    }

    if (loginResponse.ok && loginPayload.access) {
      const expiresIn = Number(loginPayload.expires_in ?? loginPayload.access_expires_in ?? 1800)
      setAuth({
        accessToken: loginPayload.access,
        refreshToken: loginPayload.refresh,
        accessTokenExpires: Date.now() + expiresIn * 1000,
        user: loginPayload.user
          ? {
              id: loginPayload.user.id,
              email: loginPayload.user.email ?? values.email,
              name: loginPayload.user.name,
              fullName: loginPayload.user.full_name,
            }
          : {
              email: values.email,
              name: values.email.split('@')[0],
              fullName: values.email.split('@')[0],
            },
      })
      router.push('/')
      return
    }

    router.push('/auth/signin')
  })

  return (
    <AuthShell
      title="Create your account"
      description="Use Zod-validated registration to set up a researcher profile with email/password."
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form className="space-y-5" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} className="pl-9" placeholder="Mostasim Rahman" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} type="password" className="pl-9" placeholder="At least 8 characters" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Repeat your password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Create account'}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
