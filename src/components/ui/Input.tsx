'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-white text-sm placeholder-zinc-500 transition-all duration-300 focus:border-gold-primary/50 focus:ring-2 focus:ring-gold-primary/20 focus:bg-zinc-900/80 hover:border-zinc-600 ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
