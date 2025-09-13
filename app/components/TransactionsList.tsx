"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Selection,
  Button,
} from "@heroui/react";
import Wrapper from "./wrapper";
import { useState, useCallback } from "react";
import { FileIcon, TrashIcon } from "@radix-ui/react-icons";

interface Transaction {
  id?: string;
  amount?: number;
  category?: string;
  description?: string;
  type?: string;
  note?: string;
  created_at?: string;
}

interface TransactionsListProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  hasMore?: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  currentPage?: number;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

const COLUMNS = [
  { key: "type", label: "TYPE" },
  { key: "category", label: "CATEGORY" },
  { key: "amount", label: "AMOUNT" },
  { key: "description", label: "DESCRIPTION" },
  { key: "note", label: "NOTE" },
  { key: "created_at", label: "CREATED AT" },
  { key: "actions", label: "ACTIONS" },
];

export default function TransactionsList({
  transactions = [],
  isLoading = false,
  hasMore = false,
  onNextPage,
  handleDelete,
  handleEdit,
  onPreviousPage,
  currentPage = 1,
}: TransactionsListProps) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const handleSelectionChange = useCallback((keys: Selection) => {
    setSelectedKeys(keys);
  }, []);

  // Render cell content with proper formatting
  const renderCell = useCallback(
    (tx: Transaction, columnKey: string) => {
      switch (columnKey) {
        case "created_at":
          return tx.created_at
            ? new Date(tx.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "-";
        case "amount":
          return tx.amount ? (
            <span
              className={`font-semibold ${
                tx.type === "income"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              ${tx.amount.toFixed(2)}
            </span>
          ) : (
            "-"
          );
        case "type":
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                tx.type === "income"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {tx.type || "-"}
            </span>
          );
        case "category":
          return (
            <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md text-xs font-medium">
              {tx.category || "-"}
            </span>
          );
        case "description":
          return (
            <span
              className="text-gray-700 dark:text-gray-300"
              title={tx.description}
            >
              {tx.description
                ? tx.description.length > 30
                  ? `${tx.description.substring(0, 30)}...`
                  : tx.description
                : "-"}
            </span>
          );
        case "note":
          return (
            <span
              className="text-gray-600 dark:text-gray-400 italic"
              title={tx.note}
            >
              {tx.note
                ? tx.note.length > 20
                  ? `${tx.note.substring(0, 20)}...`
                  : tx.note
                : "-"}
            </span>
          );
        case "actions":
          return (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                color="primary"
                variant="light"
                isIconOnly
                aria-label="Edit transaction"
                onPress={() => handleEdit?.(tx.id as string)}
              >
                <FileIcon className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="light"
                isIconOnly
                aria-label="Delete transaction"
                onPress={() => handleDelete?.(tx.id as string)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          );
        default:
          return tx[columnKey as keyof Transaction] ?? "-";
      }
    },
    [handleEdit, handleDelete]
  );

  // Table loading state
  const renderLoadingState = () => (
    <TableRow>
      <TableCell colSpan={COLUMNS.length} className="text-center py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading transactions...
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  // Table empty state
  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={COLUMNS.length} className="text-center py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-400 text-6xl">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            No transactions found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            There are no transactions to display. Try adjusting your filters or
            add a new transaction to get started.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <Wrapper className="mt-4">
      <div className="">
        <Table
          aria-label="Transactions table"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          // classNames={{
          //   wrapper: "shadow-none bg-transparent",
          //   th: "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold",
          //   td: "border-b border-gray-100 dark:border-gray-700",
          // }}
        >
          <TableHeader>
            {COLUMNS.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            loadingContent={renderLoadingState()}
            emptyContent={renderEmptyState()}
          >
            {safeTransactions.map((tx) => (
              <TableRow key={tx.id || Math.random().toString(36).slice(2)}>
                {COLUMNS.map((column) => (
                  <TableCell key={`${tx.id}-${column.key}`}>
                    {renderCell(tx, column.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex w-full justify-center mt-4 pb-4">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={currentPage}
            total={hasMore ? currentPage + 1 : currentPage}
            onChange={(page) => {
              if (page > currentPage && onNextPage) {
                onNextPage();
              } else if (page < currentPage && onPreviousPage) {
                onPreviousPage();
              }
            }}
          />
        </div>
      </div>
    </Wrapper>
  );
}
