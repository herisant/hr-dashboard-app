import React from 'react';
import { UserPlus, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  activeSection,
  onSelectSection,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            P
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              PeoplePulse
            </span>
            <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              HR Hub
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectSection('overview')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeSection === 'overview'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => onSelectSection('employees')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeSection === 'employees'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Direktori Karyawan
          </button>
          <button
            onClick={() => onSelectSection('attendance')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeSection === 'attendance'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Tren Kehadiran
          </button>
          <button
            onClick={() => onSelectSection('departments')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeSection === 'departments'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Departemen
          </button>
        </nav>

        {/* Zone 3: 1 Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Karyawan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
