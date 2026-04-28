import db from './db';

export const initDB = async (): Promise<void> => {
  try {
    await db.execAsync(`
      -- 1️⃣ customers
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        balance REAL DEFAULT 0,
        created_at INTEGER
      );

      -- 2️⃣ transactions
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        type TEXT CHECK(type IN ('udhaar', 'payment')) NOT NULL,
        amount REAL NOT NULL,
        date INTEGER NOT NULL,
        note TEXT,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );

      -- 3️⃣ items
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        transaction_id TEXT NOT NULL,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id)
      );

      -- 🔍 Indexes (performance)
      CREATE INDEX IF NOT EXISTS idx_transactions_customer
      ON transactions(customer_id);

      CREATE INDEX IF NOT EXISTS idx_items_transaction
      ON items(transaction_id);
    `);

    console.log("✅ DB Initialized");
  } catch (error) {
    console.log("❌ DB Init Error:", error);
    throw error;
  }
};