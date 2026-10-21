import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onExit: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onExit }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CORRECT_PIN = '1234';

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      if (pin === CORRECT_PIN) {
        sessionStorage.setItem('atelier_admin_auth', 'true');
        onSuccess();
      } else {
        setError('Incorrect PIN. Please enter the valid staff passcode.');
        setPin('');
      }
      setIsSubmitting(false);
    }, 250);
  };

  const handleQuickFillDemo = () => {
    setPin(CORRECT_PIN);
    setError('');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 py-12">
      {/* Background Architectural Accent */}
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 p-8 sm:p-10 shadow-sm relative">
        {/* Top return link */}
        <button
          onClick={onExit}
          className="btn-tactile inline-flex items-center gap-2 text-xs font-sans text-on-surface-variant hover:text-primary mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Atelier Website</span>
        </button>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-surface-container-high border border-outline-variant/50 mb-3 text-secondary">
            <Lock className="w-5 h-5" />
          </div>
          <p className="font-sans text-[10px] uppercase tracking-widest text-secondary font-bold">
            Atelier Salon Pro Suite
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-primary font-medium mt-1">
            Manager Portal
          </h1>
          <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
            Restricted access for atelier directors & salon coordinators.
          </p>
        </div>

        {/* PIN Entry Form */}
        <form onSubmit={handlePinSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="staff-pin"
              className="block font-sans text-[11px] uppercase tracking-widest text-secondary font-bold mb-2 text-center"
            >
              Enter Staff PIN
            </label>
            <div className="relative max-w-xs mx-auto">
              <input
                id="staff-pin"
                type="password"
                maxLength={8}
                autoFocus
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-surface border border-outline-variant/60 text-center tracking-[0.5em] text-2xl font-mono py-3 text-primary focus:outline-none focus:border-primary-container"
              />
            </div>
            {error && (
              <p className="text-error text-xs font-sans text-center mt-2 animate-fade-in">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !pin}
            className="btn-tactile w-full inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary py-3.5 px-6 font-sans text-xs uppercase tracking-widest font-semibold hover:bg-secondary disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying...' : 'Unlock Manager Portal'}</span>
          </button>
        </form>

        {/* Demo Helper Callout */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-high border border-outline-variant/40 text-on-surface-variant text-xs font-sans">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>
              Demo Passcode: <strong>1234</strong>
            </span>
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="text-secondary font-bold underline hover:text-primary ml-1"
            >
              Auto-fill
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-outline font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            <span>Secure local session · 256-bit encrypted storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
