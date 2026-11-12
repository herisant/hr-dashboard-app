import React from 'react';
import { Building2, Users } from 'lucide-react';
import { Employee, Department } from '../types';
import { DEPARTMENTS } from '../data/mockData';

interface DepartmentDistributionProps {
  employees: Employee[];
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
}

export const DepartmentDistribution: React.FC<DepartmentDistributionProps> = ({
  employees,
  selectedDepartment,
  onSelectDepartment,
}) => {
  const totalEmployees = employees.length;

  const deptCounts = DEPARTMENTS.map((dept) => {
    const count = employees.filter((e) => e.department === dept).length;
    const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
    return {
      department: dept,
      count,
      percentage,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 lg:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Distribusi Headcount per Divisi
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Alokasi sumber daya manusia di seluruh departemen startup
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {DEPARTMENTS.length} Departemen
        </div>
      </div>

      <div className="space-y-3">
        {deptCounts.map(({ department, count, percentage }) => {
          const isSelected = selectedDepartment === department;

          return (
            <button
              key={department}
              type="button"
              onClick={() =>
                onSelectDepartment(isSelected ? 'All' : department)
              }
              className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-indigo-50/60 border-indigo-200'
                  : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span
                  className={`font-medium ${
                    isSelected ? 'text-indigo-900 font-semibold' : 'text-slate-800'
                  }`}
                >
                  {department}
                </span>
                <span className="text-slate-500 font-mono tabular-nums">
                  <strong className="text-slate-900">{count}</strong> staf ({percentage}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-indigo-600'
                      : 'bg-indigo-500/70 group-hover:bg-indigo-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
