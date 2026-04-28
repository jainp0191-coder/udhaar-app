export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  balance: number;
}

export interface Transaction {
  id: string;
  customer_id: string;
  type: "udhaar" | "payment";
  amount: number;
  date: number; // ✅ includes BOTH date + time
  note?: string;
}

export interface Item {
  id: string;
  transaction_id: string;
  name: string;
  amount: number;
}