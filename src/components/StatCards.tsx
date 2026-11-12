import React from 'react';
import { Users, UserCheck, CalendarOff, Sparkles, ArrowUpRight } from 'lucide-react';
import { Employee, EmployeeStatus } from '../types';

interface StatCardsProps {
  employees: Employee[];
  activeStatusFilter: EmployeeStatus | 'All' | 'NewHires';
  onSelectStatusFilter: (status: EmployeeStatus | 'All' | 'NewHires') => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  employees,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  const totalEmployees = employees.length;
  
  // Present today: Active (in office) + Remote / WFA
  const activeInOffice = employees.filter((e) => e.status === 'Active').length;
  const remoteToday = employees.filter((e) => e.status === 'Remote / WFA').length;
  const presentToday = activeInOffice + remoteToday;
  const presentPercentage = totalEmployees > 0 
    ? Math.round((presentToday / totalEmployees) * 100) 
    : 0;

  // On leave
  const onLeave = employees.filter((e) => e.status === 'On Leave').length;

  // New hires (joined after 2024-08-01 or on probation)
  const newHires = employees.filter(
    (e) => e.status === 'Probation' || new Date(e.joinDate) >= new Date('2024-08-01')
  ).length;

  const cards = [
    {
      id: 'total',
      filterKey: 'All' as const,
      label: 'Total Employee',
      value: totalEmployees,
      badge: '+4 kuartal ini',
      subtitle: `${activeInOffice + remoteToday + onLeave} headcount · 7 tim`,
      detail: 'Pertumbuhan tim +6.2% YoY',
      icon: Users,
      iconColor: 'text-blue-600 bg-blue-50',
      activeBorder: activeStatusFilter === 'All',
    },
    {
      id: 'present',
      filterKey: 'Active' as const,
      label: 'Present Today',
      value: presentToday,
      badge: `${presentPercentage}% rate`,
      subtitle: `${activeInOffice} WFO di kantor · ${remoteToday} WFA remote`,
      detail: 'Target harian minimum 88%',
      icon: UserCheck,
      iconColor: 'text-emerald-600 bg-emerald-50',
      activeBorder: activeStatusFilter === 'Active',
    },
    {
      id: 'leave',
      filterKey: 'On Leave' as const,
      label: 'On Leave',
      value: onLeave,
      badge: `${onLeave > 0 ? `${onLeave} staf` : '0 staf'}`,
      subtitle: `${onLeave} pengajuan disetujui · 0 pending`,
      detail: 'Cuti tahunan & izin sakit terdata',
      icon: CalendarOff,
      iconColor: 'text-amber-600 bg-amber-50',
      activeBorder: activeStatusFilter === 'On Leave',
    },
    {
      id: 'newHires',
      filterKey: 'NewHires' as const,
      label: 'New Hires',
      value: newHires,
      badge: '90 hari terakhir',
      subtitle: 'Onboarding 100% tepat waktu',
      detail: 'Roadmap ekspansi tim Q4',
      icon: Sparkles,
      iconColor: 'text-purple-600 bg-purple-50',
      activeBorder: activeStatusFilter === 'NewHires',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = card.activeBorder;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatusFilter(card.filterKey)}
            className={`text-left p-5 bg-white rounded-xl border transition-all cursor-pointer hover:shadow-sm ${
              isSelected
                ? 'border-indigo-600 ring-1 ring-indigo-600 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {card.value}
              </span>
              <span className="text-xs font-medium text-slate-500">
                orang
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-2 truncate">
              {card.subtitle}
            </p>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">{card.detail}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
