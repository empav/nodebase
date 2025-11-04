"use client";

import { EntityContainer, EntityHeader } from "@/components/EntityComponents";
import {
  useSuspenseWorkflows,
  useCreateOneWorkflow,
} from "../hooks/useWorkflows";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";
import { useRouter } from "next/navigation";

export const WorkflowsList = () => {
  const ws = useSuspenseWorkflows();
  return (
    <div className="flex-1 items-center justify-center">
      <p>{JSON.stringify(ws.data, null, 2)}</p>
    </div>
  );
};

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const createWorkflow = useCreateOneWorkflow();
  const { modal, handleError } = useUpgradeModal();

  const onCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflow"
        onNew={onCreate}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowHeader />}
      search={<>search</>}
      pagination={<>pagination</>}
    >
      {children}
    </EntityContainer>
  );
};
