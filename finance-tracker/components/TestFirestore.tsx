import React, { useEffect, useState } from "react";
import { addTransaction, getTransactions, deleteTransaction } from "../lib/firestore";
import type { Transaction } from "../lib/firestore";
import { useAuth } from "@/context/AuthContext";
import AddTransactionForm from "./AddTransactionForm";

const TestFirestore = () => {
  const { user } = useAuth(); // Get logged-in user
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
        console.log("Current User ID:", user?.uid);
      getTransactions(user.uid)
        .then((data) => {
            console.log('FetchedTransactions', data)
            setTransactions([...data])
            console.log("Updated state:", transactions)
        }) 
            // Ensures correct data assignment
        .catch((error) => console.error("Error fetching transactions:", error));
    }
  }, [user]);
  useEffect(() => {
    console.log("Transactions State Updated:", transactions);
  }, [transactions]);

  const handleAddTransaction = async () => {
    if (!user) return alert("You must be logged in!");
    await addTransaction(user.uid, 10000, "income", "Salary", "Monthly Salary");
    setTransactions(await getTransactions(user.uid)); // Ensures state updates correctly
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!user) return;
    await deleteTransaction(user.uid, transactionId);
    setTransactions(await getTransactions(user.uid)); // Refresh state
  };

  return (
    <div>
      <h2>Firestore Test</h2>
      <button onClick={handleAddTransaction}>Add Transaction</button>
      <ul>
        {transactions.length > 0 ? (
        transactions.map((tx) => (
          <li key={tx.id}>
            {tx.amount} - {tx.category} - {tx.type} 
            <button onClick={() => handleDeleteTransaction(tx.id)}>Delete</button>
          </li>
        ))
    ) : (<p>No transactions found</p>)}
      </ul>
      <AddTransactionForm/>
    </div>
  );
};

export default TestFirestore;
