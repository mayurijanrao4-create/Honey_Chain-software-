import React, { useState } from 'react';
import {
  Boxes,
  ShieldCheck,
  Cpu,
  FileCode2,
  BookOpen,
  Menu,
  X,
  LogOut,
  UserCheck,
  Sparkles,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { honeyChainStore } from '../services/dataStore';
import { User, UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenDocs,
}) => {
  const [currentUser, setCurrentUser] = useState<User>(honeyChainStore.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState(false);

  React.useEffect(() => {
    return honeyChainStore.subscribe(() => {
      setCurrentUser(honeyChainStore.getCurrentUser());
    });
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    honeyChainStore.switchRole(role);
    setRoleDropdownOpen(false);
  };

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'trace', label: 'Trace Honey' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'apiaries', label: 'Apiaries & Hives' },
    { id: 'quality', label: 'Quality Lab' },
    { id: 'iot', label: 'IoT Monitor' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'schema', label: 'Database SQL' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 text-stone-100 backdrop-blur-md border-b border-stone-800">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 px-4 py-1 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
            <span>Cryptographic Ledger Active · Proof-of-Work SHA-256 Engine · Simulated IoT Telemetry</span>
          </div>
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 underline hover:text-stone-800 cursor-pointer font-bold shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Project Viva & Architecture Docs
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-500/20 group-hover:bg-amber-400 transition-colors">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <span className="font-display font-extrabold text-xl tracking-tight text-white block">
                  Honey<span className="text-amber-400">Chain</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono tracking-wider block -mt-1">
                  BLOCKCHAIN TRACEABILITY
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Role Selector & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 hover:border-amber-500/50 text-xs text-stone-200 transition-colors cursor-pointer"
                title="Switch User Role for Live Demo"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-stone-400">Role:</span>
                <span className="font-semibold text-amber-300 capitalize">{currentUser.role}</span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-stone-900 border border-stone-700 shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 border-b border-stone-800">
                    Switch Live Persona (Demo Mode):
                  </div>
                  {[
                    { role: 'admin' as UserRole, label: 'Admin (System Officer)', name: 'Dr. Vikramaditya Rao' },
                    { role: 'beekeeper' as UserRole, label: 'Beekeeper (Apiary Owner)', name: 'Raj Patil' },
                    { role: 'inspector' as UserRole, label: 'Quality Inspector (FSSAI)', name: 'Dr. Sunita Kulkarni' },
                    { role: 'processor' as UserRole, label: 'Honey Processor', name: 'Suresh Deshmukh' },
                    { role: 'distributor' as UserRole, label: 'Cold-Chain Logistics', name: 'Pooja Varma' },
                    { role: 'consumer' as UserRole, label: 'Consumer', name: 'Kavita Joshi' },
                  ].map((r) => (
                    <button
                      key={r.role}
                      onClick={() => handleRoleSelect(r.role)}
                      className={`w-full text-left px-3 py-2 hover:bg-stone-800 transition-colors flex flex-col ${
                        currentUser.role === r.role ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-stone-300'
                      }`}
                    >
                      <span>{r.label}</span>
                      <span className="text-[10px] text-stone-500">{r.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs text-stone-300 transition-colors cursor-pointer"
              title="Reset all localStorage records back to clean initial demo data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden xl:inline">Reset Demo</span>
            </button>

            {/* User Profile / Auth Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{currentUser.name.split(' ')[0]}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-900 px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-800">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-left text-xs font-medium cursor-pointer ${
                  activeTab === link.id
                    ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-stone-400">Current Role:</span>
            <span className="font-bold text-amber-400 capitalize">{currentUser.role}</span>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-1">
            {(['admin', 'beekeeper', 'inspector', 'processor', 'distributor', 'consumer'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  handleRoleSelect(r);
                  setMobileMenuOpen(false);
                }}
                className={`py-1 px-2 rounded text-[11px] capitalize cursor-pointer ${
                  currentUser.role === r ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="pt-3 flex gap-2">
            <button
              onClick={() => {
                setShowResetConfirm(true);
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-stone-800 text-stone-200 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-stone-800 text-stone-200 text-xs font-semibold text-center"
            >
              Account / Login
            </button>
            <button
              onClick={() => {
                onOpenDocs();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-amber-500 text-stone-950 text-xs font-bold text-center"
            >
              Docs
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 text-stone-900">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-stone-900">
                  Reset to Factory Demo State?
                </h3>
                <span className="text-[11px] text-stone-500">
                  Local browser storage will be refreshed
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              This will reset all batches, apiaries, hives, blockchain blocks, and laboratory records
              back to the pristine college project demonstration state. Any newly created records in
              localStorage will be replaced with default seed data.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  honeyChainStore.resetToFactoryData();
                  setShowResetConfirm(false);
                  setResetSuccessNotice(true);
                  setTimeout(() => setResetSuccessNotice(false), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow-md"
              >
                Yes, Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {resetSuccessNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white border border-amber-500/40 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Demo storage refreshed to factory seed state!</span>
        </div>
      )}
    </header>
  );
};
