import { cn } from '@/lib/utils'

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p'

interface DisplayHeadingProps {
  as?:        Tag
  children:   React.ReactNode
  size?:      'sm' | 'md' | 'lg' | 'xl' | 'monument'
  className?: string
}

const sizes = {
  sm:       'text-3xl md:text-4xl',
  md:       'text-4xl md:text-5xl lg:text-6xl',
  lg:       'text-5xl md:text-6xl lg:text-7xl',
  xl:       'text-6xl md:text-7xl lg:text-8xl',
  monument: 'text-[clamp(3.5rem,10vw,9rem)]',
}

/** Monumental display heading — uses brand display font with tight leading. */
export function DisplayHeading({ as: Tag = 'h2', children, size = 'md', className }: DisplayHeadingProps) {
  return (
    <Tag
      className={cn(
        'font-display font-black leading-[0.95] tracking-tight text-creme-os',
        sizes[size],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
