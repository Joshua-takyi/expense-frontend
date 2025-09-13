"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
interface transactionDialogProps {
  trigger?: React.ReactNode;
  triggerClassName?: string;
  onCreateSuccess?: () => void;
  onCreateError?: (error: Error) => void;
}
export default function TransactionDialog({
  trigger,
  triggerClassName,
  onCreateSuccess,
  onCreateError,
}: transactionDialogProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 640) {
          // Tailwind's 'sm' breakpoint is 640px
          // Set to full for mobile
          setIsMobile(true);
        } else {
          setIsMobile(false);
        }
      };
      window.addEventListener("resize", handleResize);
      handleResize(); // Initial check
      return () => window.removeEventListener("resize", handleResize);
    }
  });
  const customTrigger = trigger ? (
    <Button
      onPress={onOpen}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      aria-label="Open Add Transaction Dialog"
      className={`cursor-pointer ${triggerClassName}`}
    >
      {trigger}
    </Button>
  ) : null;

  const defaultTrigger = (
    <Button
      onPress={onOpen}
      tabIndex={0}
      color="danger"
      variant="shadow"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      aria-label="Open Add Transaction Dialog"
      className={`cursor-pointer ${triggerClassName}`}
    >
      Add Transaction
    </Button>
  );
  return (
    <>
      {customTrigger || defaultTrigger}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={isMobile ? "lg" : "5xl"}
        isDismissable
        // backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit enim quia excepturi repellendus quod cum iusto,
                aperiam facere officia soluta praesentium mollitia? Facere
                ducimus, ipsum et deleniti corrupti impedit, optio praesentium
                dignissimos iure perspiciatis esse quisquam a magni quidem
                expedita temporibus qui ex maxime. Voluptas dolor dolores qui id
                culpa?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
