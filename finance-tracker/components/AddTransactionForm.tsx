"use client";

import { useState, useEffect } from "react";
import { addTransaction, deleteTransaction, getTransactions, updateTransaction } from "../lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { getAuth } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, Tooltip, Label as ChartLabel } from "recharts";


const categories = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Other"];

export default function AddTransactionForm() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // Format: YYYY-MM-DD
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userId) {
        try {
          const fetchedTransactions = await getTransactions(userId);
          setTransactions(fetchedTransactions);
            let income = 0;
            let expenses = 0;

            fetchedTransactions.forEach((transaction) => {
              if (transaction.type === "income") {
                income += transaction.amount;
              } else {
                expenses += transaction.amount;
              }
             
            });
            

            setTotalIncome(income);
            setTotalExpenses(expenses);
            setBalance(income - expenses);
        } catch (error) {
          toast.error("Error fetching transactions: " + String(error));
        }
      }
    };

    fetchTransactions();
    
  }, [userId]);

  const pieData = [
    { name: "Income", value: totalIncome, color: "#22c55e" }, // Green for income
    { name: "Expenses", value: totalExpenses, color: "#ef4444" }, // Red for expenses
  ];

  const categoryTotals = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to pie chart format
  const shadcnColors = [
    "#3b82f6", // Blue (text-primary)
    "#ef4444", // Red (text-destructive)
    "#22c55e", // Green (text-success)
    "#f97316", // Orange (text-warning)
    "#a855f7", // Purple
    "#eab308", // Yellow
    "#14b8a6", // Teal
  ];
  
  const categoryPieData = Object.entries(categoryTotals).map(([key, value], index) => ({
    name: key,
    value,
    fill: shadcnColors[index % shadcnColors.length], // Assign colors in a loop
  }));
  if (!userId) return <>Please Login to add Transaction</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateTransaction(userId, editingId, {
          amount: parseFloat(amount),
          type: type as "expense" | "income",
          category,
          description,
          date,
        });
        toast.success("Transaction updated successfully!");
        setEditingId(null);
      } else {
        await addTransaction(userId, parseFloat(amount), type as "income" | "expense", category, description, date);
        toast.success("Transaction added successfully!");
      }
      
      const updatedTransactions = await getTransactions(userId);
      setTransactions(updatedTransactions);
      setAmount("");
      setDescription("");
      setCategory("Food");
    } catch (error) {
      toast.error("Error saving transaction: " + String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!userId) return;
    
    try {
      await deleteTransaction(userId, transactionId);
      const updatedTransactions = await getTransactions(userId);
      setTransactions(updatedTransactions);
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      toast.error("Error deleting transaction: " + String(error));
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingId(transaction.id);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setCategory(transaction.category);
    setDescription(transaction.description);
    setDate(transaction.date || new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-8 container mx-auto px-4 sm:px-'/../public/dashboardImage.webp' 6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Transaction" : "Add Transaction"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount"
                type="number" 
                placeholder="Amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description"
                type="text" 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full flex items-center gap-2" disabled={isSubmitting}>
              <Plus className="w-4 h-4" /> 
              {isSubmitting ? "Saving..." : editingId ? "Update Transaction" : "Add Transaction"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-green-600 font-semibold">Income</p>
                    <p className="text-xl font-bold">&#8358;{totalIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-red-600 font-semibold">Expenses</p>
                    <p className="text-xl font-bold">&#8358;{totalExpenses.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Balance</p>
                    <p className={`text-xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    &#8358;{balance.toLocaleString()}
                    </p>
                  </div>
                </div>
                <PieChart width={300} height={200}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
              </CardContent>

        </Card>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Expenses Categories</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
          <PieChart width={300} height={300}>
          <Pie
            data={categoryPieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {categoryPieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
          </CardContent>
        </Card>
        


      {transactions.length > 0 && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">
                      {transaction.description || transaction.category}{" "}
                      <span className={`ml-2 ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "income" ? "+ " : "- "}&#8358;{transaction.amount.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.category} · {new Date(transaction.date || transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditTransaction(transaction)}>
                      <Pencil className="w-4 h-4" />
                  </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

