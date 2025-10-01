'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { MoneyInput } from '@/components/money-input'

type BaseFieldConfig = {
  name: string
  label?: React.ReactElement | string
  description?: string
  show?: boolean
}

export type FieldConfig =
  | (BaseFieldConfig & { type: 'text' })
  | (BaseFieldConfig & { type: 'textarea' })
  | (BaseFieldConfig & { type: 'number' })
  | (BaseFieldConfig & { type: 'money' })
  | (BaseFieldConfig & { type: 'date' })
  | (BaseFieldConfig & { type: 'switch' })
  | (BaseFieldConfig & {
      type: 'custom'
      render: (field: {
        value: any
        onChange: (val: any) => void
        name: string
      }) => React.ReactNode
    })

export function getFieldInput(field: FieldConfig, controlledField: any) {
  switch (field.type) {
    case 'custom':
      return field.render(controlledField)
    case 'text':
      return <Input {...controlledField} />
    case 'textarea':
      return <Textarea {...controlledField} />
    case 'number':
      return (
        <Input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          min="0"
          {...controlledField}
          onChange={(e) => {
            const onlyDigits = e.target.value.replace(/\D/g, '')
            controlledField.onChange(
              onlyDigits ? parseInt(onlyDigits, 10) : undefined,
            )
          }}
        />
      )
    case 'money':
      return <MoneyInput {...controlledField} />
    case 'date':
      return <Input type="date" {...controlledField} />
    case 'switch':
      return (
        <Switch
          checked={Boolean(controlledField.value)}
          onCheckedChange={controlledField.onChange}
        />
      )
    default:
      return null
  }
}
