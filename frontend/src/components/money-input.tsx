"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface MoneyInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number // in cents
  onChange?: (value: number) => void
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const displayValue =
      value !== undefined
        ? (value / 100).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : ""

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "")
      const cents = parseInt(raw || "0", 10)
      onChange?.(cents)
    }

    return (
      <div className="flex items-center rounded-md border border-input bg-background">
        <span className="px-2 text-sm text-muted-foreground">R$</span>
        <Input
          ref={ref}
          inputMode="numeric"
          pattern="\d*"
          {...props}
          value={displayValue}
          onChange={handleChange}
          className={`flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${className ?? ""}`}
        />
      </div>
    )
  }
)

MoneyInput.displayName = "MoneyInput"
