"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/appcontext";

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description?: string;
  note?: string;
  user_id: string;
  created: string;
  updated: string;
}

export interface CreateTransactionData {
  amount: number;
  type: "income" | "expense";
  category: string;
  description?: string;
  note?: string;
}

export interface UpdateTransactionData {
  amount?: number;
  type?: "income" | "expense";
  category?: string;
  description?: string;
  note?: string;
}

export const useTransactions = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  // Get all transactions
  const getTransactions = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await api.get("/api/v1/transactions");
      return response.data.transactions as Transaction[];
    },
  });

  // Get single transaction
  const useTransaction = (id: string) =>
    useQuery({
      queryKey: ["transactions", id],
      queryFn: async () => {
        const response = await api.get(`/api/v1/transactions/${id}`);
        return response.data.transaction as Transaction;
      },
      enabled: !!id,
    });

  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (transactionData: CreateTransactionData) => {
      const response = await api.post("/api/v1/transactions", transactionData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate transactions cache to refetch data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  // Update transaction mutation
  const updateTransaction = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTransactionData;
    }) => {
      const response = await api.put(`/api/v1/transactions/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific transaction and transactions list
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({
        queryKey: ["transactions", variables.id],
      });
    },
  });

  // Delete transaction mutation
  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/v1/transactions/${id}`);
      return response.data;
    },
    onSuccess: (_, id) => {
      // Remove from cache and invalidate list
      queryClient.removeQueries({ queryKey: ["transactions", id] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return {
    getTransactions,
    useTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading:
      createTransaction.isPending ||
      updateTransaction.isPending ||
      deleteTransaction.isPending,
    isError:
      createTransaction.isError ||
      updateTransaction.isError ||
      deleteTransaction.isError,
    error:
      createTransaction.error ||
      updateTransaction.error ||
      deleteTransaction.error,
  };
};
