import React from "react"

interface Action<T> {
  render: (entity: T) => React.ReactNode
  key?: string | number
  show?: (entity: T) => boolean
}

interface ActionCellProps<T> {
  entity: T
  actions: Action<T>[]
  wrapperClassName?: string
}

export function ActionCell<T>({
  entity,
  actions,
  wrapperClassName = "flex gap-2",
}: ActionCellProps<T>) {
  return (
    <div className={wrapperClassName}>
      <>
        {actions.map((action, idx) => {
          if (action.show && !action.show(entity)) return null
          return <React.Fragment key={action.key ?? idx}>{action.render(entity)}</React.Fragment>
        })}
      </>
    </div>
  )
}
