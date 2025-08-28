import { LoadingSpinner } from './LoadingSpinner';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return <LoadingSpinner size={size} className={className} />;
}

export default Spinner;
