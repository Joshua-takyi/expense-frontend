"use client";

import TransactionNav from "@/app/components/transactionNav";
import TransactionsList from "@/app/components/TransactionsList";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useTransactions, Transaction } from "@/app/hooks/useTransactions";
import { addToast } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
export default function TransactionsComponent() {
  // Lifted state: pagination, search and filters
  const [limit, setLimit] = useState<string>("10");
  const [offset, setOffset] = useState<string>("0");
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [amountOrder, setAmountOrder] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dateOrder, setDateOrder] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<string>("");
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );
  const { deleteTransaction } = useTransactions();

  // Reset filters function
  const resetFilters = () => {
    setAmountOrder("");
    setDateOrder("");
    setSelectedCategories([]);
    setAmountRange("");
    setOffset("0");
  };

  // Reset offset when filters change
  const handleFilterChange = () => {
    setOffset("0");
  };

  // Reset offset when search query changes
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setOffset("0");
  };

  const handleDeleteRequest = (id: string) => {
    setTransactionToDelete(id);
    onOpen();
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction.mutate(transactionToDelete, {
        onSuccess: () => {
          addToast({
            title: "Success",
            description: "Transaction deleted successfully",
            color: "success",
          });
          setTransactionToDelete(null);
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "Failed to delete transaction",
            color: "danger",
          });
        },
      });
    }
  };

  const { useGetTransactions, useGetTransactionsByQuery } = useTransactions();

  // Use search/filter query when there are filters applied or search query
  const searchAndFilterRes = useGetTransactionsByQuery(
    selectedCategories,
    dateOrder || amountOrder, // Use whichever order is set
    amountRange, // Amount range filter
    limit,
    debouncedQuery, // Search query
    offset
  );

  // Use default transactions query
  const allRes = useGetTransactions(limit, offset);

  // Determine which data to use based on precedence: search > filters > all
  const hasActiveFilters =
    selectedCategories.length > 0 || amountOrder || dateOrder || amountRange;
  const hasSearchQuery = debouncedQuery.trim().length > 0;

  const transactions: Transaction[] =
    hasSearchQuery || hasActiveFilters
      ? searchAndFilterRes.data ?? []
      : allRes.data ?? [];

  const isLoading =
    hasSearchQuery || hasActiveFilters
      ? searchAndFilterRes.isLoading
      : allRes.isLoading;

  // Calculate if there are more items for pagination
  const hasMore = transactions.length >= parseInt(limit);

  return (
    <div className="lg:p-4 p-2">
      {isOpen && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Confirm Delete Transaction
                </ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to delete this transaction? This
                    action cannot be undone.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => {
                      confirmDelete();
                      onClose();
                    }}
                    isLoading={deleteTransaction.isPending}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <TransactionNav
        query={query}
        onQueryChange={handleQueryChange}
        amountOrder={amountOrder}
        onAmountOrderChange={(order) => {
          setAmountOrder(order);
          setDateOrder(""); // Clear date order when amount order is set
          handleFilterChange();
        }}
        dateOrder={dateOrder}
        onDateOrderChange={(order) => {
          setDateOrder(order);
          setAmountOrder(""); // Clear amount order when date order is set
          handleFilterChange();
        }}
        selectedCategories={selectedCategories}
        onCategoriesChange={(categories) => {
          setSelectedCategories(categories);
          handleFilterChange();
        }}
        onResetFilters={resetFilters}
        limit={limit}
        setLimit={setLimit}
        setOffset={setOffset}
      />
      <TransactionsList
        transactions={transactions}
        isLoading={isLoading}
        hasMore={hasMore}
        handleDelete={handleDeleteRequest}
        handleEdit={undefined}
        onNextPage={() =>
          setOffset((prev) => (parseInt(prev) + parseInt(limit)).toString())
        }
        onPreviousPage={() =>
          setOffset((prev) =>
            Math.max(0, parseInt(prev) - parseInt(limit)).toString()
          )
        }
        currentPage={Math.floor(parseInt(offset) / parseInt(limit)) + 1}
      />
    </div>
  );
}
