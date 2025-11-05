"use client";

import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/EntityComponents";
import {
  useSuspenseWorkflows,
  useCreateOneWorkflow,
} from "../hooks/useWorkflows";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";
import { useRouter } from "next/navigation";
import useWorkflowsParams from "../hooks/useWorkflowsParams";
import { useEntitySearch } from "@/hooks/useEntitySearch";

export const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowsParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Workflows"
    />
  );
};

export const WorkflowsList = () => {
  const ws = useSuspenseWorkflows();
  return (
    <div className="flex-1 items-center justify-center">
      <p>{JSON.stringify(ws.data, null, 4)}</p>
    </div>
  );
};

export const WorkflowPagination = () => {
  const ws = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      disabled={ws.isFetching}
      page={ws.data.page}
      totalPages={ws.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
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
      search={<WorkflowSearch />}
      pagination={<WorkflowPagination />}
    >
      {children}
    </EntityContainer>
  );
};
