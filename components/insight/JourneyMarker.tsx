import { cn } from '@/lib/utils';

const steps = ['Express', 'Interpret', 'Understand', 'Connect'];

export function JourneyMarker({ current, className }: { current: number; className?: string }) {
  return (
    <ol className={cn('journey-marker flex-wrap', className)} aria-label="Insight journey">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2" aria-current={index + 1 === current ? 'step' : undefined}>
          <span>{String(index + 1).padStart(2, '0')}</span><span className={index + 1 === current ? undefined : 'hidden sm:inline'}>{step}</span>{index < steps.length - 1 ? <i aria-hidden="true" className="h-px w-4 bg-line sm:w-7" /> : null}
        </li>
      ))}
    </ol>
  );
}
