import React, { useState } from 'react';
import {
  Users,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Download,
  Plus,
  RefreshCw,
  Bell,
} from 'lucide-react';
import { Employee, Department, EmployeeStatus, MonthlyAttendance } from './types';
import { INITIAL_EMPLOYEES, ATTENDANCE_TREND_DATA } from './data/mockData';
import { Navbar } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { AttendanceChart } from './components/AttendanceChart';
import { EmployeeTable } from './components/EmployeeTable';
import { DepartmentDistribution } from './components/DepartmentDistribution';
import { AddEmployeeModal } from './components/AddEmployeeModal';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'All' | 'NewHires'>('All');
  const [activeSection, setActiveSection] = useState<string>('overview');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<Employee | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show transient toast notification
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add new employee handler
  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees((prev) => [newEmployee, ...prev]);
    showToast(`Karyawan ${newEmployee.name} berhasil ditambahkan ke divisi ${newEmployee.department}!`);
  };

  // Update employee status (e.g. toggle Active <-> On Leave <-> Remote)
  const handleUpdateStatus = (employeeId: string, newStatus: EmployeeStatus) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === employeeId ? { ...emp, status: newStatus } : emp))
    );
    if (selectedEmployeeForDetail && selectedEmployeeForDetail.id === employeeId) {
      setSelectedEmployeeForDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Status kehadiran karyawan berhasil diperbarui menjadi ${newStatus}!`);
  };

  // Delete employee handler
  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
    showToast('Data karyawan berhasil dihapus dari direktori.');
  };

  // Section smooth scrolling or switching
  const handleSelectSection = (section: string) => {
    setActiveSection(section);
    if (section === 'employees') {
      const el = document.getElementById('employee-directory-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'attendance') {
      const el = document.getElementById('attendance-chart-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'departments') {
      const el = document.getElementById('departments-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Dashboard Title & Startup Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <span>NextStack Technologies Inc.</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-normal">Dashboard SDM & Kehadiran</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Human Resources Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pantau metrik tim, absensi 6 bulan terakhir, dan kelola direktori talenta startup.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block font-mono">
                Pembaruan Terakhir
              </span>
              <span className="text-xs font-semibold text-slate-700">
                Hari ini, 12 Nov 2026 · 09:30 WIB
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast('Data absensi & HR berhasil disinkronisasi ulang!');
              }}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer border border-slate-200 bg-white"
              title="Muat ulang sinkronisasi absensi"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. 4 STAT CARDS (total employee, present today, on leave, new hires) */}
        <section aria-label="Statistik Kunci HR">
          <StatCards
            employees={employees}
            activeStatusFilter={statusFilter}
            onSelectStatusFilter={(status) => {
              setStatusFilter(status);
              const tableSection = document.getElementById('employee-directory-section');
              tableSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* 2. ATTENDANCE TREND (6 Months Line Chart) & DEPARTMENT DISTRIBUTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Line Chart untuk Attendance Trend 6 Bulan Terakhir */}
          <section id="attendance-chart-section" className="lg:col-span-2">
            <AttendanceChart data={ATTENDANCE_TREND_DATA} />
          </section>

          {/* Department Breakdown */}
          <section id="departments-section" className="lg:col-span-1">
            <DepartmentDistribution
              employees={employees}
              selectedDepartment={selectedDepartment}
              onSelectDepartment={(dept) => {
                setSelectedDepartment(dept);
                const tableSection = document.getElementById('employee-directory-section');
                tableSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </section>
        </div>

        {/* 3. EMPLOYEE TABLE with Department Filter Dropdown, Search & Status Filter */}
        <section id="employee-directory-section">
          <EmployeeTable
            employees={employees}
            selectedDepartment={selectedDepartment}
            onChangeDepartment={setSelectedDepartment}
            statusFilter={statusFilter}
            onChangeStatusFilter={setStatusFilter}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSelectEmployee={setSelectedEmployeeForDetail}
            onUpdateStatus={handleUpdateStatus}
          />
        </section>
      </main>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={handleAddEmployee}
      />

      {/* Employee Detail Slideover / Modal */}
      <EmployeeDetailModal
        employee={selectedEmployeeForDetail}
        onClose={() => setSelectedEmployeeForDetail(null)}
        onUpdateStatus={handleUpdateStatus}
        onDeleteEmployee={handleDeleteEmployee}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-lg border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
