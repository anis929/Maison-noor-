import { cn } from '@/lib/utils'

interface HaloBackgroundProps {
  intensity?: 'low' | 'medium' | 'high'
  position?:  'center' | 'top' | 'bottom-left' | 'top-right'
  className?: string
}

const intensities = {
  low:    'opacity-60',
  medium: 'opacity-100',
  high:   'opacity-100 scale-125',
}

const positions = {
  'center':      'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'top':         'top-0 left-1/2 -translate-x-1/2 -translate-y-1/3',
  'bottom-left': 'bottom-0 left-0 translate-y-1/3 -translate-x-1/4',
  'top-right':   'top-0 right-0 -translate-y-1/4 translate-x-1/4',
}

/**
 * Blurred orange radial halo — placed absolutely behind hero content.
 * Wrap parent in `position: relative overflow-hidden`.
 */
export function HaloBackground({ intensity = 'medium', position = 'center', className }: HaloBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute w-[70vmax] h-[70vmax] rounded-full',
        'bg-[radial-gradient(ellipse_at_center,rgba(212,84,28,0.22)_0%,transparent_65%)]',
        'blur-[80px]',
        intensities[intensity],
        positions[position],
        className,
      )}
    />
  )
}
