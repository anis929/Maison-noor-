import { cn } from '@/lib/utils'

interface MonoLabelProps {
  children:   React.ReactNode
  className?: string
  dim?:       boolean
}

/** Small monospace metadata label — for specs, numbering, edition info. */
export function MonoLabel({ children, className, dim = false }: MonoLabelProps) {
  return (
    <span
      className={cn(
        'font-mono text-[0.7rem] tracking-[0.2em] uppercase',
        dim ? 'text-creme-os/40' : 'text-chrome',
        className,
      )}
    >
      {children}
    </span>
  )
}
