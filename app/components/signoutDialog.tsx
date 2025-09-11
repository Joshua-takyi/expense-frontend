"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { ExitIcon } from "@radix-ui/react-icons";
import { useAuth } from "../hooks/useAuth";
import { useCallback } from "react";

interface SignOutDialogProps {
  /**
   * Custom trigger element. If not provided, defaults to an exit icon button.
   */
  trigger?: React.ReactNode;
  /**
   * Additional className for the trigger element
   */
  triggerClassName?: string;
  /**
   * Callback fired when sign out is successful
   */
  onSignOutSuccess?: () => void;
  /**
   * Callback fired when sign out fails
   */
  onSignOutError?: (error: Error) => void;
}

/**
 * A reusable sign-out confirmation dialog component.
 * Provides a modal dialog to confirm user logout with proper error handling and loading states.
 */
export default function SignOutDialog({
  trigger,
  triggerClassName = "",
  onSignOutSuccess,
  onSignOutError,
}: SignOutDialogProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { logout } = useAuth();

  const handleSignOut = useCallback(async () => {
    try {
      await logout.mutateAsync();
      onOpenChange(); // Close modal
      onSignOutSuccess?.();
    } catch (error) {
      // Don't close modal on error so user can retry
      onSignOutError?.(
        error instanceof Error ? error : new Error("Sign out failed")
      );
    }
  }, [logout, onOpenChange, onSignOutSuccess, onSignOutError]);

  const handleCancel = useCallback(() => {
    onOpenChange();
  }, [onOpenChange]);

  // Default trigger element
  const defaultTrigger = (
    <Tooltip content="Sign out" placement="bottom" delay={500}>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={onOpen}
        className={`hover:bg-danger-50 hover:text-danger-600 transition-colors ${triggerClassName}`}
        aria-label="Sign out"
      >
        <ExitIcon className="w-4 h-4" />
      </Button>
    </Tooltip>
  );

  // Custom trigger with click handler
  const customTrigger = trigger ? (
    <span
      onClick={onOpen}
      className={`cursor-pointer ${triggerClassName}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label="Sign out"
    >
      {trigger}
    </span>
  ) : null;

  return (
    <>
      {customTrigger || defaultTrigger}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="opaque"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-foreground">
                  Confirm Sign Out
                </h2>
              </ModalHeader>

              <ModalBody>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/20 flex items-center justify-center">
                    <ExitIcon className="w-5 h-5 text-warning-600 dark:text-warning-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-default-700 leading-relaxed">
                      Are you sure you want to sign out? You will need to log in
                      again to access your expense tracking data.
                    </p>
                    {logout.isError && (
                      <div className="mt-3 p-3 rounded-lg bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800">
                        <p className="text-sm text-danger-700 dark:text-danger-400">
                          Failed to sign out. Please try again.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="gap-2">
                <Button
                  variant="flat"
                  onPress={handleCancel}
                  disabled={logout.isPending}
                  className="min-w-20"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleSignOut}
                  isLoading={logout.isPending}
                  disabled={logout.isPending}
                  className="min-w-20"
                  startContent={
                    !logout.isPending ? <ExitIcon className="w-4 h-4" /> : null
                  }
                >
                  {logout.isPending ? "Signing out..." : "Sign Out"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
