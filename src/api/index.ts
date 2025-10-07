import type { Expense, ExpenseCreate, MonthlySummary } from '../types/index';

const API_BASE = 'http://localhost:8000';

export const api = {
  async getFriends(): Promise<{ friends: string[] }> {
    const response = await fetch(`${API_BASE}/friends`);
    return response.json();
  },

  async getExpenses(): Promise<Expense[]> {
    const response = await fetch(`${API_BASE}/expenses`);
    return response.json();
  },

  async createExpense(expense: ExpenseCreate): Promise<Expense> {
    const response = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    return response.json();
  },

  async deleteExpense(id: number): Promise<void> {
    await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  async getCurrentSummary(): Promise<MonthlySummary> {
    const response = await fetch(`${API_BASE}/current-summary`);
    return response.json();
  },

  async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    const response = await fetch(`${API_BASE}/summary/${year}/${month}`);
    return response.json();
  },
};
