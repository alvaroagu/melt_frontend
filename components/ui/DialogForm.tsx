"use client"

import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"

type SubmitHandler = (...args: unknown[]) => unknown | Promise<unknown>

type DialogFormSubmitProps = {
  onSubmit?: SubmitHandler
}

export type DialogFormProps<T extends Record<string, unknown> = Record<string, unknown>> = {
  Form: React.ComponentType<T>
  formProps?: T
  title?: string
  description?: string
  trigger?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showCloseButton?: boolean
  closeOnSubmit?: boolean
  className?: string
}

/**
 * DialogForm
 * - Renders a provided Form component inside the Dialog primitives.
 * - Prefer external control via `open` / `onOpenChange`. Falls back to internal state when `open` is undefined.
 * - If `closeOnSubmit` is true and the provided formProps includes an `onSubmit`, the dialog will close after the submit handler resolves.
 *
 * Example:
 * <DialogForm
 *   Form={ProductForm}
 *   formProps={{ categories, onSubmit }}
 *   trigger={<button>Nuevo producto</button>}
 * />
 */
export default function DialogForm<T extends Record<string, unknown> = Record<string, unknown>>({
  Form,
  formProps,
  title,
  description,
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  showCloseButton = true,
  closeOnSubmit = false,
  className,
}: DialogFormProps<T>) {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState<boolean>(defaultOpen)
  const openState = isControlled ? (open as boolean) : internalOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  // If formProps has onSubmit and closeOnSubmit, wrap it so dialog can close after submit
  const wrappedFormProps = React.useMemo(() => {
    if (!formProps) return formProps

    const props = { ...(formProps as T & DialogFormSubmitProps) }
    const originalOnSubmit = props.onSubmit

    if (closeOnSubmit && originalOnSubmit) {
      props.onSubmit = async (...args: unknown[]) => {
        const res = await originalOnSubmit(...args)
        setOpen(false)
        return res
      }
    }

    return props as T
  }, [formProps, closeOnSubmit, setOpen])

  return (
    <Dialog open={openState} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger>{trigger}</DialogTrigger> : null}

      <DialogContent className={className} showCloseButton={showCloseButton}>
        {(title || description) && (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? <div className="text-sm text-muted-foreground">{description}</div> : null}
          </DialogHeader>
        )}

        {/* Render the form component */}
        <div data-slot="dialog-form-content">
          <Form {...(wrappedFormProps as T)} />
        </div>

        <DialogFooter showCloseButton={showCloseButton} />
      </DialogContent>
    </Dialog>
  )
}
