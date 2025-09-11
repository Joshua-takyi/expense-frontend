"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  useTransactions,
  CreateTransactionData,
} from "../hooks/useTransactions";

export default function AddTransactionForm() {
  const [formData, setFormData] = useState<CreateTransactionData>({
    amount: 0,
    type: "expense",
    category: "",
    description: "",
    note: "",
  });

  const { createTransaction } = useTransactions();

  const categories = [
    { key: "food", label: "Food & Dining" },
    { key: "transport", label: "Transportation" },
    { key: "shopping", label: "Shopping" },
    { key: "entertainment", label: "Entertainment" },
    { key: "bills", label: "Bills & Utilities" },
    { key: "healthcare", label: "Healthcare" },
    { key: "salary", label: "Salary" },
    { key: "freelance", label: "Freelance" },
    { key: "investment", label: "Investment" },
    { key: "other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTransaction.mutateAsync(formData);
      // Reset form on success
      setFormData({
        amount: 0,
        type: "expense",
        category: "",
        description: "",
        note: "",
      });
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-xl font-bold">Add Transaction</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            label="Amount"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            value={formData.amount.toString()}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: parseFloat(e.target.value) || 0,
              })
            }
            isRequired
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
          />

          <Select
            label="Type"
            placeholder="Select transaction type"
            selectedKeys={[formData.type]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setFormData({
                ...formData,
                type: selected as "income" | "expense",
              });
            }}
            isRequired
          >
            <SelectItem key="income">Income</SelectItem>
            <SelectItem key="expense">Expense</SelectItem>
          </Select>

          <Select
            label="Category"
            placeholder="Select category"
            selectedKeys={formData.category ? [formData.category] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setFormData({ ...formData, category: selected || "" });
            }}
            isRequired
          >
            {categories.map((category) => (
              <SelectItem key={category.key}>{category.label}</SelectItem>
            ))}
          </Select>

          <Input
            type="text"
            label="Description"
            placeholder="Brief description (optional)"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <Input
            type="text"
            label="Note"
            placeholder="Additional notes (optional)"
            value={formData.note || ""}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />

          {createTransaction.isError && (
            <div className="text-sm text-danger">
              {createTransaction.error?.message ||
                "Failed to create transaction"}
            </div>
          )}

          <Button
            type="submit"
            color="primary"
            className="w-full"
            isLoading={createTransaction.isPending}
            isDisabled={!formData.amount || !formData.category}
          >
            {createTransaction.isPending ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
