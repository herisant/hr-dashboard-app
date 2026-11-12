import { Employee } from '../types';

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function calculateTenure(dateString: string): string {
  try {
    const start = new Date(dateString);
    const now = new Date('2026-11-12'); // matching current system date
    const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    
    if (diffMonths <= 0) return 'Bulan pertama';
    if (diffMonths < 12) return `${diffMonths} bln`;
    const years = Math.floor(diffMonths / 12);
    const remMonths = diffMonths % 12;
    return remMonths > 0 ? `${years} thn ${remMonths} bln` : `${years} thn`;
  } catch {
    return '';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

export function exportEmployeesToCSV(employees: Employee[], filename = 'employee_directory.csv') {
  const headers = ['ID', 'Nama', 'Email', 'Role', 'Department', 'Status', 'Join Date', 'Lokasi', 'Tipe'];
  const rows = employees.map((emp) => [
    `"${emp.id}"`,
    `"${emp.name}"`,
    `"${emp.email}"`,
    `"${emp.role}"`,
    `"${emp.department}"`,
    `"${emp.status}"`,
    `"${emp.joinDate}"`,
    `"${emp.location}"`,
    `"${emp.workType}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
