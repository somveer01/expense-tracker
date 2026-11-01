export interface BankAccount {
  id: string;
  bankName: string; // e.g. "HDFC Bank", "PNB", "Chase", "Cash in Hand"
  accountType: 'savings' | 'current' | 'salary' | 'fd' | 'cash' | 'wallet';
  accountNumberLast4?: string;
  balance: number;
  color?: string;
  updatedAt: string;
}

export interface MoneyLent {
  id: string;
  borrowerName: string; // Person who borrowed money
  totalAmount: number; // Total amount lent
  amountReceived: number; // Amount repaid so far
  remainingAmount: number; // Remaining amount to collect
  lentDate: string; // Date money was lent
  expectedReturnDate?: string; // Expected repayment date
  phone?: string;
  notes?: string;
  status: 'active' | 'partially_settled' | 'fully_settled';
}

export interface DebtLoan {
  id: string;
  lenderName: string; // Bank name or Person name
  type: 'personal_loan' | 'home_loan' | 'car_bike_loan' | 'credit_card' | 'borrowed_friend_family' | 'other';
  totalAmount: number; // Original loan/borrowed amount
  amountRepaid: number; // Amount repaid so far
  remainingAmount: number; // Remaining balance to clear
  monthlyEMI?: number; // Monthly EMI amount
  dueDay?: number; // Day of month when payment is due
  notes?: string;
  status: 'active' | 'closed';
}

export interface BudgetCategory {
  id: string;
  name: string; // e.g. "House Rent", "Loan EMI", "Food & Groceries", "Gas & Utilities"
  budgetedAmount: number; // Declared monthly budget allocation
  isEssential: boolean; // Essential survival need vs Discretionary want
  icon?: string;
}

export interface MonthlyBudgetDeclaration {
  id: string;
  monthYear: string; // "YYYY-MM" format e.g. "2026-11"
  categories: BudgetCategory[];
  totalBudgeted: number;
  notes?: string;
  updatedAt: string;
}

export interface DailyExpense {
  id: string;
  date: string; // YYYY-MM-DD
  categoryId: string;
  categoryName: string;
  amount: number;
  title: string; // Item or service purchased
  bankAccountId?: string; // Account from which payment was made
  notes?: string;
  createdAt: string;
}

export interface SurvivalAnalysis {
  totalCapital: number;
  totalReceivables: number; // Money lent to be collected
  totalPayables: number; // Debts & loans to be repaid
  netWorth: number;
  monthlyBurnRate: number; // Total declared monthly expenditure
  essentialMonthlyBurnRate: number; // Survival essential burn rate
  actualSpentThisMonth: number;
  daysRemaining: number;
  monthsRemaining: number;
  essentialDaysRemaining: number;
  essentialMonthsRemaining: number;
  runwayDate: string; // Estimated date when capital depletes
  runwayDateEssential: string; // Depletion date under lean survival mode
}
