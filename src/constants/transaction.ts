export const CATEGORIES = [
  { value: "groceries", label: "Groceries" },
  { value: "dining", label: "Dining & Restaurants" },
  { value: "transportation", label: "Transportation" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "shopping", label: "Shopping" },
  { value: "healthcare", label: "Healthcare" },
  { value: "travel", label: "Travel" },
  { value: "housing", label: "Housing & Rent" },
  { value: "income", label: "Income" },
  { value: "investments", label: "Investments" },
  { value: "other", label: "Other" },
];

export const PAYMENT_METHODS_ENUM = {
  CARD: "CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  MOBILE_PAYMENT: "MOBILE_PAYMENT",
  CASH: "CASH",
  AUTO_DEBIT: "AUTO_DEBIT",
  OTHER: "OTHER",
} as const;

export const PAYMENT_METHODS = [
  { value: PAYMENT_METHODS_ENUM.CARD, label: "Credit/Debit Card" },
  { value: PAYMENT_METHODS_ENUM.CASH, label: "Cash" },
  { value: PAYMENT_METHODS_ENUM.BANK_TRANSFER, label: "Bank Transfer" },
  { value: PAYMENT_METHODS_ENUM.MOBILE_PAYMENT, label: "Mobile Payment" },
  { value: PAYMENT_METHODS_ENUM.AUTO_DEBIT, label: "Auto Debit" },
  { value: PAYMENT_METHODS_ENUM.OTHER, label: "Other" },
];

export const TRANSACTION_FREQUENCY = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type TransactionFrequencyType =
  (typeof TRANSACTION_FREQUENCY)[keyof typeof TRANSACTION_FREQUENCY];

export const TRANSACTION_TYPE = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export const FREQUENCY_OPTIONS = [
  { value: TRANSACTION_FREQUENCY.DAILY, label: "Daily" },
  { value: TRANSACTION_FREQUENCY.WEEKLY, label: "Weekly" },
  { value: TRANSACTION_FREQUENCY.MONTHLY, label: "Monthly" },
  { value: TRANSACTION_FREQUENCY.YEARLY, label: "Yearly" },
];
