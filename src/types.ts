export type Department =
  | 'Engineering'
  | 'Product'
  | 'Design'
  | 'Marketing'
  | 'People & Culture'
  | 'Sales & BD'
  | 'Finance & Ops';

export type EmployeeStatus =
  | 'Active'
  | 'On Leave'
  | 'Remote / WFA'
  | 'Probation';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: Department;
  status: EmployeeStatus;
  joinDate: string; // ISO date 'YYYY-MM-DD' or formatted
  avatar?: string;
  phone?: string;
  location: string;
  workType: 'Full-time' | 'Contract' | 'Internship';
}

export interface MonthlyAttendance {
  month: string;
  rate: number; // e.g. 93.5%
  present: number;
  onLeave: number;
  remote: number;
  totalWorkdays: number;
}
