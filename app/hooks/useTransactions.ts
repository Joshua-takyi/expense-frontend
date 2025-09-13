"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../context/appcontext";
import { addToast } from "@heroui/react";

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description?: string;
  note?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
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

  const useGetTransactions = (limit?: string, offset?: string) =>
    useQuery({
      queryKey: ["transactions", limit, offset],
      queryFn: async () => {
        const response = await api.get(
          `/transactions?limit=${limit}&offset=${offset}`
        );
        // debug line
        // console.log("Fetched transactions:", response);
        return response.data.data as Transaction[];
      },
    });

  const useGetTransactionsByQuery = (
    category: string[],
    order: string,
    amount: string,
    limit: string,
    search?: string,
    offset?: string
  ) =>
    useQuery({
      queryKey: [
        "filterTransactions",
        search,
        category,
        order,
        amount,
        limit,
        offset,
      ],
      queryFn: async () => {
        const categoryParams = category
          .map((cat) => `category=${encodeURIComponent(cat)}`)
          .join("&");
        const searchParam = search
          ? `search=${encodeURIComponent(search)}`
          : "";
        const amountParam = amount
          ? `amount=${encodeURIComponent(amount)}`
          : "";
        const orderParam = order ? `order=${encodeURIComponent(order)}` : "";
        const limitParam = `limit=${limit}`;
        const offsetParam = offset ? `offset=${offset}` : "offset=0";

        // Build query string with only non-empty parameters
        const params = [
          searchParam,
          categoryParams,
          orderParam,
          amountParam,
          limitParam,
          offsetParam,
        ]
          .filter((param) => param.length > 0)
          .join("&");

        const response = await api.get(`/transactions-query/?${params}`);
        return response.data.data as Transaction[];
      },
      enabled:
        (typeof search === "string" && search.trim().length > 0) ||
        category.length > 0 ||
        order.trim().length > 0 ||
        amount.trim().length > 0, // Only run query when there's a search term or filter
    });

  // Get single transaction
  const useTransaction = (id: string) =>
    useQuery({
      queryKey: ["transactionsById", id],
      queryFn: async () => {
        const response = await api.get(`/api/v1/transactions/${id}`);
        return response.data.transaction as Transaction;
      },
      enabled: !!id,
    });

  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (transactionData: CreateTransactionData) => {
      const response = await api.post("/transactions", transactionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      addToast({
        title: "Success",
        description: "Transaction Created successfully",
      });
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
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    },
    onSuccess: (_, id) => {
      // Remove from cache and invalidate list
      queryClient.removeQueries({ queryKey: ["transactions", id] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return {
    useGetTransactions,
    useTransaction,
    useGetTransactionsByQuery,
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
