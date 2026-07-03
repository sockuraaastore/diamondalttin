'use client';

import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'default' | 'ghost' | 'outline' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  className = '',
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    default: 'bg-gradient-to-r from-gold-primary to-gold-dark text-black hover:from-gold-light hover:to-gold-primary hover:scale-105 active:scale-95',
    primary: 'bg-gradient-to-r from-gold-primary to-gold-dark text-black hover:from-gold-light hover:to-gold-primary hover:scale-105 active:scale-95',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105 active:scale-95',
    ghost: 'bg-transparent text-zinc-300 hover:text-gold-primary hover:bg-gold-primary/10',
    outline: 'bg-transparent border border-gold-primary/30 text-gold-primary hover:bg-gold-primary/10 hover:border-gold-primary/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
      {children}
    </button>
  );
}
