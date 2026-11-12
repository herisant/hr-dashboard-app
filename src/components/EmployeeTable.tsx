import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Plus,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Briefcase,
  ChevronDown,
  UserX,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Employee, Department, EmployeeStatus } from '../types';
import { DEPARTMENTS } from '../data/mockData';
import { formatDate, calculateTenure, getInitials, exportEmployeesToCSV } from '../utils/formatters';

interface EmployeeTableProps {
  employees: Employee[];
  selectedDepartment: string;
  onChangeDepartment: (dept: string) => void;
  statusFilter: EmployeeStatus | 'All' | 'NewHires';
  onChangeStatusFilter: (status: EmployeeStatus | 'All' | 'NewHires') => void;
  onOpenAddModal: () => void;
  onSelectEmployee: (employee: Employee) => void;
  onUpdateStatus: (employeeId: string, newStatus: EmployeeStatus) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  selectedDepartment,
  onChangeDepartment,
  statusFilter,
  onChangeStatusFilter,
  onOpenAddModal,
  onSelectEmployee,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // 1. Department filter
      if (selectedDepartment !== 'All' && emp.department !== selectedDepartment) {
        return false;
      }

      // 2. Status filter
      if (statusFilter === 'NewHires') {
        const isRecent =
          emp.status === 'Probation' || new Date(emp.joinDate) >= new Date('2024-08-01');
        if (!isRecent) return false;
      } else if (statusFilter !== 'All' && emp.status !== statusFilter) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = emp.name.toLowerCase().includes(query);
        const matchEmail = emp.email.toLowerCase().includes(query);
        const matchRole = emp.role.toLowerCase().includes(query);
        const matchDept = emp.department.toLowerCase().includes(query);
        return matchName || matchEmail || matchRole || matchDept;
      }

      return true;
    });
  }, [employees, selectedDepartment, statusFilter, searchQuery]);

  // Handle export to CSV
  const handleExport = () => {
    const filename = `karyawan_${selectedDepartment.toLowerCase().replace(/\s+/g, '_')}_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    exportEmployeesToCSV(filteredEmployees, filename);
  };

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Hadir / WFO
          </span>
        );
      case 'Remote / WFA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Remote / WFA
          </span>
        );
      case 'On Leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-md border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Cuti / Izin
          </span>
        );
      case 'Probation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md border border-purple-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Probation
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Control Bar: Department Dropdown, Search, Status filter & Export */}
      <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Direktori Karyawan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar staf aktif tech startup, divisi kerja, dan status kehadiran
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Unduh daftar karyawan saat ini sebagai file CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Ekspor CSV</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Staf</span>
            </button>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, posisi, atau email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Department Filter Dropdown (Explicitly requested) */}
            <div className="relative flex items-center">
              <label htmlFor="dept-filter" className="sr-only">
                Filter Department
              </label>
              <div className="relative">
                <select
                  id="dept-filter"
                  value={selectedDepartment}
                  onChange={(e) => onChangeDepartment(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="All">Semua Department (All)</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Status Quick Filter Tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => onChangeStatusFilter('All')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'All'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => onChangeStatusFilter('Active')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'Active'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hadir
              </button>
              <button
                type="button"
                onClick={() => onChangeStatusFilter('Remote / WFA')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'Remote / WFA'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Remote
              </button>
              <button
                type="button"
                onClick={() => onChangeStatusFilter('On Leave')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'On Leave'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cuti
              </button>
              <button
                type="button"
                onClick={() => onChangeStatusFilter('Probation')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'Probation'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Probation
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter indicator pill bar */}
        {(selectedDepartment !== 'All' || statusFilter !== 'All' || searchQuery !== '') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Menampilkan <strong>{filteredEmployees.length}</strong> dari{' '}
              <strong>{employees.length}</strong> karyawan
              {selectedDepartment !== 'All' && ` · Divisi: ${selectedDepartment}`}
              {statusFilter !== 'All' && ` · Status: ${statusFilter}`}
            </span>
            <button
              type="button"
              onClick={() => {
                onChangeDepartment('All');
                onChangeStatusFilter('All');
                setSearchQuery('');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium underline cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3 px-4 sm:px-6">
                Nama & Kontak
              </th>
              <th scope="col" className="py-3 px-4">
                Department
              </th>
              <th scope="col" className="py-3 px-4">
                Status
              </th>
              <th scope="col" className="py-3 px-4">
                Join Date
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => {
                const isMenuOpen = activeMenuId === emp.id;

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Kolom 1: Nama, Foto/Avatar, Email, Role */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          {emp.avatar ? (
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                              onError={(e) => {
                                // Fallback if image path fails
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 ${
                              emp.avatar ? 'hidden' : ''
                            }`}
                          >
                            {getInitials(emp.name)}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onSelectEmployee(emp)}
                            className="text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate block max-w-xs cursor-pointer"
                          >
                            {emp.name}
                          </button>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="truncate">{emp.role}</span>
                            <span aria-hidden="true" className="text-slate-300">
                              ·
                            </span>
                            <span className="truncate text-slate-400 font-mono text-[11px]">
                              {emp.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Department */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 text-xs sm:text-sm">
                          {emp.department}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          {emp.location}
                        </span>
                      </div>
                    </td>

                    {/* Kolom 3: Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(emp.status)}
                      </div>
                    </td>

                    {/* Kolom 4: Join Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 text-xs sm:text-sm tabular-nums font-mono">
                          {formatDate(emp.joinDate)}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          {calculateTenure(emp.joinDate)}
                        </span>
                      </div>
                    </td>

                    {/* Kolom 5: Aksi */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="relative inline-block text-left">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onSelectEmployee(emp)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                            title="Lihat profil lengkap"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick status cycle button */}
                          <button
                            type="button"
                            onClick={() => {
                              const statuses: EmployeeStatus[] = [
                                'Active',
                                'Remote / WFA',
                                'On Leave',
                                'Probation',
                              ];
                              const nextIdx =
                                (statuses.indexOf(emp.status) + 1) % statuses.length;
                              onUpdateStatus(emp.id, statuses[nextIdx]);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Ubah status kehadiran"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 px-4 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <UserX className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">
                      Tidak ada karyawan ditemukan
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 text-center">
                      Coba ubah kata kunci pencarian atau ganti filter divisi & status yang dipilih.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeDepartment('All');
                        onChangeStatusFilter('All');
                        setSearchQuery('');
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="py-3 px-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Total direktori: <strong className="text-slate-800 tabular-nums">{employees.length}</strong> karyawan
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Aktif difilter: <strong className="text-indigo-600 tabular-nums">{filteredEmployees.length}</strong> karyawan
          </span>
        </div>

        <div className="text-slate-400">
          Sinkronisasi kehadiran terverifikasi per hari ini
        </div>
      </div>
    </div>
  );
};
