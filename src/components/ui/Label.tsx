import { forwardRef } from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`
          text-sm font-medium leading-none text-gray-900 dark:text-white
          peer-disabled:cursor-not-allowed peer-disabled:opacity-70
          ${className}
        `}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';
