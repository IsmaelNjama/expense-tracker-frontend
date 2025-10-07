import { useState, useEffect } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { MonthlySummary } from './components/MonthlySummary';
import { api } from './api';
import type { Expense, ExpenseCreate, MonthlySummary as MonthlySummaryType } from './types';

function App() {
  const [friends, setFriends] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<MonthlySummaryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [friendsData, expensesData, summaryData] = await Promise.all([
        api.getFriends(),
        api.getExpenses(),
        api.getCurrentSummary(),
      ]);
      
      setFriends(friendsData.friends);
      setExpenses(expensesData.reverse()); // Show newest first
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData: ExpenseCreate) => {
    try {
      const newExpense = await api.createExpense(expenseData);
      setExpenses([newExpense, ...expenses]);
      
      // Refresh summary
      const summaryData = await api.getCurrentSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await api.deleteExpense(id);
      setExpenses(expenses.filter(exp => exp.id !== id));
      
      // Refresh summary
      const summaryData = await api.getCurrentSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">Cost Tracker</div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Cost Tracker</h1>
          <p className="text-muted-foreground">
            Track shared expenses easily with friends.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ExpenseForm friends={friends} onSubmit={handleAddExpense} />
            <MonthlySummary summary={summary} />
          </div>
          
          <div>
            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
