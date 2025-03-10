import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; // Import Firestore from firebase.ts

export type Transaction = {
    id: string;
    amount: number;
    category: string;
    type: string;
  };

export const addTransaction = async (
  userId: string,
  amount: number,
  type: "income" | "expense",
  category: string,
  description: string,
  date:string
) => {
  try {
    await addDoc(collection(db, "users", userId, "transactions"), {
      amount,
      type,
      category,
      description,
      createdAt: new Date(),
    });
    console.log("Transaction added successfully!");
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
};

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
    if (!userId) return [];
  
    // Reference the subcollection under users/{userId}/transactions
    const transactionsRef = collection(db, "users", userId, "transactions");
    const querySnapshot = await getDocs(transactionsRef);
  
    console.log("🔥 Firestore Data (Fetched from users/{userId}/transactions):", querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        amount: data.amount ?? 0,
        category: data.category ?? "Unknown",
        type: data.type ?? "expense",
        description: data.description ?? "",
        date: data.createdAt?.toDate?.() ?? new Date()
      };
    });
  };

export const deleteTransaction = async (userId: string, transactionId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId, "transactions", transactionId));
    console.log("Transaction deleted!");
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
};

export const updateTransaction = async (
  userId: string,
  transactionId: string,
  updatedData: { amount: number; category: string; description: string; type: "income" | "expense"; date: string } // Add 'date'
) => {
  try {
    const transactionRef = doc(db, "users", userId, "transactions", transactionId);
    await updateDoc(transactionRef, updatedData);
    console.log("Transaction updated successfully!");
  } catch (error) {
    console.error("Error updating transaction:", error);
  }
};