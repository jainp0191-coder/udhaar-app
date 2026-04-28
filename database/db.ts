import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('udhaar.db');

export default db;