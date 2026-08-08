import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '../../lib/utils'

const Progress = ({ className, value, ...props }) => (
  <ProgressPrimitive.Root
    className={cn('tech-bar', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="tech-bar-fill"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
)
Progress.displayName = 'Progress'

export { Progress }
