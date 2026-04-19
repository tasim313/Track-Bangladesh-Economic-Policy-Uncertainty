'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const payload = (await response.json().catch(() => ({}))) as { message?: string }

    if (!response.ok) {
      toast.error(payload.message ?? 'Unable to request a reset.')
      return
    }

    toast.success(payload.message ?? 'Reset instructions sent.')
  })

  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email and we’ll trigger the token-based password recovery flow."
      footer={
        <p className="text-sm text-muted-foreground">
          Back to{' '}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            sign in
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

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Send reset link'}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
