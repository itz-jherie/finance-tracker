"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import TestFirestore from "@/components/TestFirestore";
import AddTransactionForm from "@/components/AddTransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div>
  <Navbar />
  <div className="p-6 bg-background">
    <Card className="shadow-lg border rounded-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Welcome, {user.displayName}</CardTitle>
        <p className="text-muted-foreground">Track your income and expenses here.</p>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </CardContent>
    </Card>

    <AddTransactionForm />
  </div>
</div>
  );
}