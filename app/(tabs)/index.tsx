import React, { useState , useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList } from "react-native";
import { initDB } from '../../database/init';

import db from "../../database/db";        // adjust path if needed
import app from "../../services/firebase"; // adjust path if needed

import { addCustomer, getCustomers, addTransaction, addItems } from "../../database/service";

export default function HomeScreen() {

  useEffect(() => {
    initDB();

    const testDB = async () => {
      await addCustomer({
        id: Date.now().toString(),
        name: "Test User",
        balance: 0,
      });

    const customers = await getCustomers();
    console.log("Customers:", customers);
  };
  testDB();
  }, []);
  
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [items, setItems] = useState<{ name: string; amount: string }[]>([]);
  const [useItems, setUseItems] = useState(false);

  console.log("DB:", db);
  console.log("Firebase:", app);

  const addEntry = async () => {
    if (!name) return;

  let finalAmount = 0;

  if (useItems) {
    finalAmount = calculateTotal();
  } else {
    finalAmount = Number(amount);
  }

  if (!finalAmount || isNaN(finalAmount)) return;

  const transactionId = Date.now().toString();

  await addTransaction({
    id: transactionId,
    customer_id: "TEMP_ID",
    type: "udhaar",
    amount: finalAmount,
    date: Date.now(),
  });

  if (useItems) {
    const formattedItems = items.map((item) => ({
      id: Date.now().toString() + Math.random(),
      transaction_id: transactionId,
      name: item.name,
      amount: Number(item.amount),
    }));

    await addItems(formattedItems);
  }

  // 🔥 ADD THIS (IMPORTANT)
  const newEntry = {
    id: transactionId,
    name,
    amount: finalAmount,
  };

  setEntries([newEntry, ...entries]);

  // reset
  setItems([]);
  setAmount("");
  setName("");
  };

  const addItem = () => {
    setItems([...items, { name: "", amount: "" }]);
  };

  const updateItem = (index: number, field: "name" | "amount", value: string) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const amt = Number(item.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  };

  return (
  <View style={styles.container}>
    <Text style={styles.title}>📒 Udhaar App (Test)</Text>

    {/* Customer Name */}
    <TextInput
      placeholder="Customer Name"
      value={name}
      onChangeText={setName}
      style={styles.input}
    />

    {/* Toggle Mode */}
    <Button
      title={useItems ? "Switch to Simple Entry" : "Switch to Item Entry"}
      onPress={() => setUseItems(!useItems)}
    />

    {/* 🔹 Simple Amount Mode */}
    {!useItems && (
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
    )}

    {/* 🔹 Item-Based Mode */}
    {useItems && (
      <>
        {items.map((item, index) => (
          <View key={index}>
            <TextInput
              placeholder="Item name"
              value={item.name}
              onChangeText={(text) => updateItem(index, "name", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Amount"
              value={item.amount}
              keyboardType="numeric"
              onChangeText={(text) => updateItem(index, "amount", text)}
              style={styles.input}
            />
          </View>
        ))}

        <Button title="Add Item" onPress={addItem} />

        <Text style={{ marginVertical: 10, fontWeight: "bold" }}>
          Total: ₹ {calculateTotal()}
        </Text>
      </>
    )}

    {/* Add Entry */}
    <Button title="Add Entry" onPress={addEntry} />

    {/* Temporary List (for testing) */}
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.entry}>
          <Text>{item.name}</Text>
          <Text>₹ {item.amount}</Text>
        </View>
      )}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  entry: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
});
