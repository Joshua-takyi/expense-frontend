"use client";

import {
  Modal,
  Input,
  Select,
  SelectItem,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import {
  CreateTransactionData,
  useTransactions,
} from "../hooks/useTransactions";

interface TransactionDialogProps {
  trigger?: React.ReactNode;
  triggerClassName?: string;
}

export default function TransactionDialog({
  trigger,
  triggerClassName,
}: TransactionDialogProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { createTransaction } = useTransactions();

  const [formData, setFormData] = useState<CreateTransactionData>({
    amount: 0,
    type: "expense",
    category: "",
    description: "",
    note: "",
  });

  const categories = {
    expense: [
      { key: "food", label: "Food & Dining" },
      { key: "transport", label: "Transportation" },
      { key: "shopping", label: "Shopping" },
      { key: "entertainment", label: "Entertainment" },
      { key: "bills", label: "Bills & Utilities" },
      { key: "healthcare", label: "Healthcare" },
      { key: "other", label: "Other" },
    ],
    income: [
      { key: "salary", label: "Salary" },
      { key: "freelance", label: "Freelance" },
      { key: "investment", label: "Investment" },
      { key: "business", label: "Business" },
      { key: "other", label: "Other" },
    ],
  };

  const resetForm = () => {
    setFormData({
      amount: 0,
      type: "expense",
      category: "",
      description: "",
      note: "",
    });
  };

  const handleSubmit = async () => {
    if (!formData.amount || formData.amount <= 0 || !formData.category) return;

    try {
      await createTransaction.mutateAsync(formData);
      resetForm();
      onOpenChange();
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  const currentCategories = categories[formData.type];
  const isFormValid = formData.amount > 0 && formData.category;

  const TriggerButton = () => (
    <Button
      onPress={onOpen}
      color="primary"
      variant="solid"
      className={triggerClassName}
      size="md"
    >
      {trigger || "Add Transaction"}
    </Button>
  );

  return (
    <>
      <TriggerButton />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        isDismissable
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-lg font-semibold">Add Transaction</h2>
              </ModalHeader>

              <ModalBody className="space-y-4">
                {/* Transaction Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        formData.type === "income" ? "solid" : "bordered"
                      }
                      color={formData.type === "income" ? "success" : "default"}
                      size="sm"
                      onPress={() =>
                        setFormData({
                          ...formData,
                          type: "income",
                          category: "",
                        })
                      }
                      className="flex-1"
                    >
                      Income
                    </Button>
                    <Button
                      variant={
                        formData.type === "expense" ? "solid" : "bordered"
                      }
                      color={formData.type === "expense" ? "danger" : "default"}
                      size="sm"
                      onPress={() =>
                        setFormData({
                          ...formData,
                          type: "expense",
                          category: "",
                        })
                      }
                      className="flex-1"
                    >
                      Expense
                    </Button>
                  </div>
                </div>

                {/* Amount */}
                <Input
                  label="Amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  value={
                    formData.amount === 0 ? "" : formData.amount.toString()
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  startContent="$"
                  isRequired
                />

                {/* Category */}
                <Select
                  label="Category"
                  placeholder="Select category"
                  selectedKeys={formData.category ? [formData.category] : []}
                  onSelectionChange={(keys) =>
                    setFormData({
                      ...formData,
                      category: (Array.from(keys)[0] as string) || "",
                    })
                  }
                  isRequired
                >
                  {currentCategories.map((category) => (
                    <SelectItem key={category.key}>{category.label}</SelectItem>
                  ))}
                </Select>

                {/* Description */}
                <Input
                  label="Description"
                  placeholder="Brief description (optional)"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                {/* Notes */}
                <Textarea
                  label="Notes"
                  placeholder="Additional notes (optional)"
                  value={formData.note || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  minRows={2}
                  maxRows={4}
                />

                {/* Error Message */}
                {createTransaction.isError && (
                  <div className="text-sm text-danger">
                    {createTransaction.error?.message ||
                      "Failed to create transaction"}
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={createTransaction.isPending}
                  isDisabled={!isFormValid}
                  onPress={handleSubmit}
                >
                  {createTransaction.isPending
                    ? "Adding..."
                    : "Add Transaction"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
