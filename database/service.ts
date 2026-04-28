// database/service.ts
import db from "./db";
import { Customer, Transaction, Item } from "../types";

export const addCustomer = async (customer: Customer) => {
  await db.runAsync(
    `INSERT INTO customers (id, name, phone, address, balance, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      customer.id,
      customer.name,
      customer.phone ?? null,
      customer.address ?? null,
      0,
      Date.now(),
    ]
  );
};

export const getCustomers = async (): Promise<Customer[]> => {
  const result = await db.getAllAsync(`SELECT * FROM customers ORDER BY created_at DESC`);
  return result as Customer[];
};

export const addTransaction = async (tx: Transaction) => {
  await db.runAsync(
    `INSERT INTO transactions (id, customer_id, type, amount, date, note)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      tx.id,
      tx.customer_id,
      tx.type,
      tx.amount,
      tx.date,
      tx.note ?? null,
    ]
  );

  // 🔥 Update balance
  const sign = tx.type === "udhaar" ? 1 : -1;

  await db.runAsync(
    `UPDATE customers
     SET balance = balance + ?
     WHERE id = ?`,
    [sign * tx.amount, tx.customer_id]
  );
};

export const getTransactions = async (customerId: string): Promise<Transaction[]> => {
  const result = await db.getAllAsync(
    `SELECT * FROM transactions
     WHERE customer_id = ?
     ORDER BY date DESC`,
    [customerId]
  );

  return result as Transaction[];
};

export const addItems = async (items: Item[]) => {
  for (const item of items) {
    await db.runAsync(
      `INSERT INTO items (id, transaction_id, name, amount)
       VALUES (?, ?, ?, ?)`,
      [item.id, item.transaction_id, item.name, item.amount]
    );
  }
};


