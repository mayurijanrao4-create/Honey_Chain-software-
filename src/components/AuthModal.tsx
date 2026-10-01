import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Lock,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  KeyRound,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { honeyChainStore, DEMO_USERS } from '../services/dataStore';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('beekeeper');
  const [loginEmail, setLoginEmail] = useState('raj.patil@greenvalley.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  // Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const users = honeyChainStore.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (found) {
      honeyChainStore.setCurrentUser(found);
      setMessage(`Welcome back, ${found.name}! Signed in as ${found.role}.`);
      setTimeout(() => {
        onClose();
        setMessage('');
        onLoginSuccess?.(found.role);
      }, 700);
    } else {
      setError('User with this email not found. Please try one of the demo accounts below.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!regName || !regEmail) {
      setError('Please fill all required fields.');
      return;
    }

    const newUser = honeyChainStore.registerUser({
      name: regName,
      email: regEmail,
      role: selectedRole,
      phone: regPhone || '+91 90000 00000',
      address: regAddress || 'India',
    });

    setMessage(`Account created successfully! Logged in as ${newUser.name}.`);
    setTimeout(() => {
      onClose();
      setMessage('');
      onLoginSuccess?.(newUser.role);
    }, 700);
  };

  const handleDemoUserSelect = (email: string) => {
    setLoginEmail(email);
    const user = DEMO_USERS.find((u) => u.email === email);
    if (user) {
      honeyChainStore.setCurrentUser(user);
      setMessage(`Switched to ${user.name} (${user.role}).`);
      setTimeout(() => {
        onClose();
        setMessage('');
        onLoginSuccess?.(user.role);
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wide">
              Role-Based Authentication
            </span>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              {authMode === 'login'
                ? 'Sign In to Honey Chain'
                : authMode === 'register'
                ? 'Register System Account'
                : 'Reset Credentials'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success or Error Notices */}
        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* LOGIN MODE */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>Password</span>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-amber-600 hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors cursor-pointer shadow-md"
            >
              Sign In
            </button>

            {/* Quick 1-Click Demo Profiles */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <span className="text-[11px] font-bold text-stone-500 block">
                Quick 1-Click Demo Personas:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Beekeeper (Raj Patil)', email: 'raj.patil@greenvalley.com' },
                  { label: 'Inspector (Dr. Sunita)', email: 'sunita.k@apilab.gov.in' },
                  { label: 'Processor (Suresh)', email: 'processing@sataraorganic.com' },
                  { label: 'Admin (Dr. Vikram)', email: 'admin@honeychain.io' },
                ].map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    onClick={() => handleDemoUserSelect(demo.email)}
                    className="p-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-400 text-left cursor-pointer transition-colors text-[11px]"
                  >
                    <span className="font-semibold text-stone-800 block truncate">{demo.label}</span>
                    <span className="text-[10px] text-stone-400 block truncate">{demo.email}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-2 text-stone-500">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="font-bold text-amber-700 hover:underline cursor-pointer"
              >
                Register Here
              </button>
            </div>
          </form>
        )}

        {/* REGISTER MODE */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Select System Role *</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-bold bg-white text-stone-800"
              >
                <option value="beekeeper">Beekeeper (Apiary Owner / Farmer)</option>
                <option value="inspector">Quality Inspector (Laboratory Analyst)</option>
                <option value="processor">Honey Processor (Cold-Extraction Unit)</option>
                <option value="distributor">Distributor (Logistics Partner)</option>
                <option value="consumer">Consumer (Honey Buyer / Verifier)</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Ramesh Kadam"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="ramesh@apiary.in"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Physical Address</label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Satara, Maharashtra"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Password *</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Confirm Password *</label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors cursor-pointer shadow-md mt-2"
            >
              Create Account
            </button>

            <div className="text-center pt-2 text-stone-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-amber-700 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD MODE */}
        {authMode === 'forgot' && (
          <div className="space-y-4 text-xs">
            <p className="text-stone-600">
              Enter your registered email address and we will generate a secure reset link.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2.5 rounded-xl border border-stone-300"
            />
            <button
              type="button"
              onClick={() => {
                setMessage('Password reset token generated and dispatched to your email.');
                setTimeout(() => setAuthMode('login'), 1500);
              }}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold cursor-pointer"
            >
              Send Reset Link
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-stone-500 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
