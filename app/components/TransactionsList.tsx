"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { useTransactions, Transaction } from "../hooks/useTransactions";

export default function TransactionsList() {
  const { getTransactions, deleteTransaction } = useTransactions();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete transaction:", error);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (getTransactions.isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (getTransactions.isError) {
    return (
      <div className="text-center py-8">
        <p className="text-danger">Failed to load transactions</p>
        <Button
          color="primary"
          variant="light"
          onClick={() => getTransactions.refetch()}
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const transactions = getTransactions.data || [];

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recent Transactions</h2>

      <div className="space-y-3">
        {transactions.map((transaction: Transaction) => (
          <Card key={transaction.id} className="w-full">
            <CardBody>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Chip
                      color={
                        transaction.type === "income" ? "success" : "danger"
                      }
                      variant="flat"
                      size="sm"
                    >
                      {transaction.type === "income" ? "Income" : "Expense"}
                    </Chip>
                    <span className="text-sm text-gray-500 capitalize">
                      {transaction.category}
                    </span>
                  </div>

                  <div className="mb-2">
                    <p className="font-semibold text-lg">
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>

                  {transaction.description && (
                    <p className="text-sm text-gray-600 mb-1">
                      {transaction.description}
                    </p>
                  )}

                  {transaction.note && (
                    <p className="text-xs text-gray-500 mb-2">
                      Note: {transaction.note}
                    </p>
                  )}

                  <p className="text-xs text-gray-400">
                    {formatDate(transaction.created)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={() => handleDelete(transaction.id)}
                    isLoading={deleteTransaction.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
