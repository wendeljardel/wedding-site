import { useId } from 'react'

type Variant = 'sage' | 'gold' | 'magenta' | 'terracotta' | 'mixed'
type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

interface Props {
  variant?: Variant
  position?: Position
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const COLORS: Record<Variant, [string, string, string]> = {
  sage: ['rgba(141, 160, 107, 0.45)', 'rgba(89, 106, 80, 0.25)', 'rgba(212, 175, 55, 0.15)'],
  gold: ['rgba(212, 175, 55, 0.4)', 'rgba(217, 164, 0, 0.25)', 'rgba(227, 132, 20, 0.15)'],
  magenta: ['rgba(209, 0, 105, 0.22)', 'rgba(181, 36, 130, 0.18)', 'rgba(212, 175, 55, 0.12)'],
  terracotta: ['rgba(163, 59, 18, 0.2)', 'rgba(227, 132, 20, 0.25)', 'rgba(141, 160, 107, 0.15)'],
  mixed: ['rgba(141, 160, 107, 0.3)', 'rgba(209, 0, 105, 0.15)', 'rgba(212, 175, 55, 0.25)'],
}

const POSITION: Record<Position, string> = {
  'top-left': '-top-16 -left-16 md:-top-24 md:-left-24',
  'top-right': '-top-16 -right-16 md:-top-24 md:-right-24',
  'bottom-left': '-bottom-16 -left-16 md:-bottom-24 md:-left-24',
  'bottom-right': '-bottom-16 -right-16 md:-bottom-24 md:-right-24',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
}

const SIZE: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-48 h-48 md:w-64 md:h-64',
  md: 'w-72 h-72 md:w-96 md:h-96',
  lg: 'w-96 h-96 md:w-[32rem] md:h-[32rem]',
}

export default function WatercolorDecor({
  variant = 'mixed',
  position = 'top-right',
  className = '',
  size = 'md',
}: Props) {
  const uid = useId().replace(/:/g, '')
  const [c1, c2, c3] = COLORS[variant]
  const filterId = `wc-${uid}`

  return (
    <div
      aria-hidden
      className={`watercolor-decor pointer-events-none absolute ${POSITION[position]} ${SIZE[size]} ${className}`}
    >
      <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="28" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <ellipse
          cx="200"
          cy="180"
          rx="160"
          ry="140"
          fill={c1}
          filter={`url(#${filterId})`}
          transform="rotate(-8 200 200)"
        />
        <ellipse
          cx="240"
          cy="220"
          rx="120"
          ry="100"
          fill={c2}
          filter={`url(#${filterId})`}
          transform="rotate(12 200 200)"
        />
        <ellipse
          cx="160"
          cy="240"
          rx="90"
          ry="80"
          fill={c3}
          filter={`url(#${filterId})`}
          transform="rotate(-15 200 200)"
        />
      </svg>
    </div>
  )
}

export function WatercolorDivider() {
  return (
    <div aria-hidden className="watercolor-divider mx-auto my-10 md:my-14">
      <svg viewBox="0 0 280 24" className="w-48 md:w-64 h-auto mx-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wc-divider-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-sage)" stopOpacity="0" />
            <stop offset="25%" stopColor="var(--color-sage)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="var(--color-gold)" stopOpacity="0.8" />
            <stop offset="75%" stopColor="var(--color-magenta)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-orchid)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M10 12 Q70 4 140 12 T270 12"
          fill="none"
          stroke="url(#wc-divider-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx="140" cy="12" r="3" fill="var(--color-gold)" opacity="0.6" />
      </svg>
    </div>
  )
}

/** Separador botânico com ramos e florinha central */
export function BotanicalSeparator({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 my-12 md:my-16 ${className}`}>
      <svg viewBox="0 0 160 32" className="w-32 md:w-44 h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* ramo esquerdo */}
        <path d="M0 16 Q20 16 40 16" stroke="var(--color-sand)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M8 16 Q14 10 20 8" stroke="var(--color-sage)" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>
        <path d="M16 16 Q22 10 28 7" stroke="var(--color-sage)" strokeWidth="0.9" strokeLinecap="round" opacity="0.6"/>
        <path d="M8 16 Q14 22 20 24" stroke="var(--color-sage-dark)" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
        <path d="M24 16 Q30 22 36 25" stroke="var(--color-sage)" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
        {/* florinha central */}
        <circle cx="80" cy="16" r="2" fill="var(--color-gold)" opacity="0.8"/>
        <circle cx="80" cy="10" r="1.5" fill="var(--color-magenta)" opacity="0.5"/>
        <circle cx="80" cy="22" r="1.5" fill="var(--color-sage)" opacity="0.5"/>
        <circle cx="74" cy="16" r="1.5" fill="var(--color-orange)" opacity="0.5"/>
        <circle cx="86" cy="16" r="1.5" fill="var(--color-orchid)" opacity="0.5"/>
        <path d="M80 12 L80 8" stroke="var(--color-gold)" strokeWidth="0.7" opacity="0.4"/>
        <path d="M80 20 L80 24" stroke="var(--color-gold)" strokeWidth="0.7" opacity="0.4"/>
        <path d="M76 16 L72 16" stroke="var(--color-gold)" strokeWidth="0.7" opacity="0.4"/>
        <path d="M84 16 L88 16" stroke="var(--color-gold)" strokeWidth="0.7" opacity="0.4"/>
        {/* ramo direito */}
        <path d="M120 16 Q140 16 160 16" stroke="var(--color-sand)" strokeWidth="1" strokeLinecap="round"/>
        <path d="M132 16 Q138 10 144 8" stroke="var(--color-sage)" strokeWidth="0.9" strokeLinecap="round" opacity="0.6"/>
        <path d="M140 16 Q146 10 152 7" stroke="var(--color-sage)" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>
        <path d="M124 16 Q130 22 136 25" stroke="var(--color-sage)" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
        <path d="M140 16 Q146 22 152 24" stroke="var(--color-sage-dark)" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/>
        {/* linhas de conexão */}
        <path d="M40 16 Q60 16 72 16" stroke="var(--color-sand)" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
        <path d="M88 16 Q100 16 120 16" stroke="var(--color-sand)" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
      </svg>
    </div>
  )
}
