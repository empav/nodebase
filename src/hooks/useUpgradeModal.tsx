import UpgradeModal from "@/components/UpgradeModal";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";

export const useUpgradeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError && error.data?.code === "FORBIDDEN") {
      setIsOpen(true);
      return true;
    }
    return false;
  };

  const modal = <UpgradeModal open={isOpen} onOpenChange={setIsOpen} />;
  return { modal, handleError };
};
