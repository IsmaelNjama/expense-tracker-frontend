import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { type MonthlySummary as MonthlySummaryType } from '../types';

interface MonthlySummaryProps {
  summary: MonthlySummaryType | null;
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ summary }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading summary...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {formatMonth(summary.month)} Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-2xl font-bold">
            {formatCurrency(summary.total_expenses)}
          </div>
          <div className="text-sm text-muted-foreground">Total Expenses</div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Expenses by Person</h4>
          <div className="space-y-2">
            {Object.entries(summary.expenses_by_person).map(([person, amount]) => (
              <div key={person} className="flex justify-between">
                <span>{person}</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Settlement</h4>
          <div className="space-y-3">
            {Object.entries(summary.settlement).map(([person, data]) => (
              <div key={person} className="border rounded-lg p-3">
                <div className="font-medium mb-2">{person}</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Paid:</span>
                    <span>{formatCurrency(data.paid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Should pay:</span>
                    <span>{formatCurrency(data.should_pay)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Balance:</span>
                    <span className={data.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {data.balance >= 0 ? '+' : ''}{formatCurrency(data.balance)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {data.balance > 0 
                      ? `${person} is owed ${formatCurrency(data.balance)}`
                      : data.balance < 0
                      ? `${person} owes ${formatCurrency(Math.abs(data.balance))}`
                      : `${person} is settled up`
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
