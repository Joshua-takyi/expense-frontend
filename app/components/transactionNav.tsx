"use client";

import Wrapper from "./wrapper";
import { Input } from "@heroui/input";
import TransactionDialog from "./addTransactionDialog";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { amount, categories, date } from "../_doc/docs";

type Props = {
  query: string;
  onQueryChange: (q: string) => void;
  amountOrder: string;
  onAmountOrderChange: (order: string) => void;
  dateOrder: string;
  onDateOrderChange: (order: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  onResetFilters: () => void;
  limit?: string;
  setLimit?: (l: string) => void;
  setOffset?: (o: string) => void;
};

const TransactionNav = ({
  query,
  onQueryChange,
  amountOrder,
  onAmountOrderChange,
  dateOrder,
  onDateOrderChange,
  selectedCategories,
  onCategoriesChange,
  onResetFilters,
  limit,
  setLimit,
  setOffset,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  return (
    <Wrapper>
      <div className="flex justify-between items-center space-y-6">
        <span className="text-2xl font-bold">Transactions</span>
        <TransactionDialog trigger={<span>Add Transaction</span>} />
      </div>

      <section className="grid lg:grid-cols-6 grid-cols-2 gap-4 ">
        <div className="mt-3.5 col-span-3 relative">
          <Input
            radius="sm"
            value={query}
            size="sm"
            onChange={handleChange}
            className="h-full"
            type="text"
            label="Search by name, amount, or note"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onQueryChange(query);
              }
            }}
          />
        </div>
        <div className="mt-3.5 lg:col-span-3 col-span-2 flex justify-end gap-4">
          {limit && setLimit && setOffset && (
            <Select
              className="max-w-xs"
              label="Items per page"
              size="sm"
              selectedKeys={[limit]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) {
                  setLimit(selected);
                  // Reset offset when changing limit
                  setOffset("0");
                }
              }}
            >
              <SelectItem key="5">5</SelectItem>
              <SelectItem key="10">10</SelectItem>
              <SelectItem key="20">20</SelectItem>
              <SelectItem key="50">50</SelectItem>
            </Select>
          )}
          <Select
            label="sort by amount"
            size="sm"
            selectedKeys={amountOrder ? [amountOrder] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              onAmountOrderChange(selected || "");
            }}
          >
            {amount.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
          <Select
            label="sort by date"
            size="sm"
            selectedKeys={dateOrder ? [dateOrder] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              onDateOrderChange(selected || "");
            }}
          >
            {date.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
          <Select
            label="filter by category"
            size="sm"
            selectionMode="multiple"
            selectedKeys={selectedCategories}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys) as string[];
              onCategoriesChange(selected);
            }}
          >
            {categories.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
          {(amountOrder || dateOrder || selectedCategories.length > 0) && (
            <Button
              size="sm"
              variant="light"
              color="warning"
              onPress={onResetFilters}
              className="mt-3.5"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </section>
    </Wrapper>
  );
};

export default TransactionNav;
