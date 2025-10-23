'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { formatBRL } from '@/lib/utils'

interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number // in cents
  onChange?: (value: number) => void
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const displayValue = value ? formatBRL(value, false) : ''

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '')
      const cents = Number(raw || 0)
      onChange?.(cents)
    }

    return (
      <div className="flex items-center rounded-md border border-input bg-background">
        <span className="px-2 text-sm text-muted-foreground">R$</span>
        <Input
          ref={ref}
          inputMode="numeric"
          pattern="[0-9.,]*"
          {...props}
          value={displayValue}
          onChange={handleChange}
          className={`flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${className ?? ''}`}
        />
      </div>
    )
  },
)

MoneyInput.displayName = 'MoneyInput'
