import React from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  Shield,
  Trash2,
} from 'lucide-react';
import { Employee, EmployeeStatus } from '../types';
import { formatDate, calculateTenure, getInitials } from '../utils/formatters';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onUpdateStatus: (employeeId: string, newStatus: EmployeeStatus) => void;
  onDeleteEmployee: (employeeId: string) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onUpdateStatus,
  onDeleteEmployee,
}) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header with profile hero */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div
                className={`w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center border-2 border-white shadow-sm ${
                  employee.avatar ? 'hidden' : ''
                }`}
              >
                {getInitials(employee.name)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {employee.name}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {employee.id}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">
                {employee.role}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>{employee.department}</span>
                <span aria-hidden="true">·</span>
                <span>{employee.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          {/* Quick status switch selector */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Ubah Status Kehadiran Hari Ini:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(['Active', 'Remote / WFA', 'On Leave', 'Probation'] as EmployeeStatus[]).map(
                (statusOption) => {
                  const isCurrent = employee.status === statusOption;
                  return (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => onUpdateStatus(employee.id, statusOption)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {statusOption === 'Active'
                        ? 'Hadir (WFO)'
                        : statusOption === 'Remote / WFA'
                        ? 'Remote (WFA)'
                        : statusOption === 'On Leave'
                        ? 'Cuti / Izin'
                        : 'Probation'}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Contact and Work Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 border border-slate-100 rounded-lg">
              <span className="text-slate-400 block mb-1">Email Perusahaan</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-800 font-mono">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{employee.email}</span>
              </div>
            </div>

            <div className="p-3 border border-slate-100 rounded-lg">
              <span className="text-slate-400 block mb-1">Nomor Kontak</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-800 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{employee.phone || '+62 812-4455-8901'}</span>
              </div>
            </div>

            <div className="p-3 border border-slate-100 rounded-lg">
              <span className="text-slate-400 block mb-1">Tanggal Bergabung</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="tabular-nums font-mono">{formatDate(employee.joinDate)}</span>
                <span className="text-slate-400">({calculateTenure(employee.joinDate)})</span>
              </div>
            </div>

            <div className="p-3 border border-slate-100 rounded-lg">
              <span className="text-slate-400 block mb-1">Tipe Kontrak</span>
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{employee.workType}</span>
              </div>
            </div>
          </div>

          {/* HR & Attendance Summary info */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-semibold text-slate-800 mb-2">
              Statistik Kehadiran 3 Bulan Terakhir
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 block">Tingkat Hadir</span>
                <span className="text-base font-bold text-emerald-600 font-mono">
                  96.4%
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 block">Sisa Cuti Tahunan</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  10 hari
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 block">Izin Terpakai</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  2 hari
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Hapus data ${employee.name} dari direktori?`)) {
                onDeleteEmployee(employee.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Karyawan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
