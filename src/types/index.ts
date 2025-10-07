export interface Expense {
  id: number;
  description: string;
  amount: number;
  paid_by: string;
  date: string;
}

export interface ExpenseCreate {
  description: string;
  amount: number;
  paid_by: string;
  date?: string;
}

export interface MonthlySummary {
  month: string;
  year: number;
  total_expenses: number;
  expenses_by_person: Record<string, number>;
  settlement: Record<string, {
    paid: number;
    should_pay: number;
    balance: number;
  }>;
}
