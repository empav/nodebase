"use client";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/EntityComponents";
import { formatDistanceToNow } from "date-fns";
import useRuntimeExecutionsParams from "../hooks/useRuntimeExecutionParams";
import { useSuspenseRuntimeExecutions } from "../hooks/useRuntimeExecutions";
import { type Execution, ExecutionStatus } from "@prisma/client";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

export const RuntimeExecutionsHeader = () => {
  return (
    <EntityHeader
      title="Runtime Executions"
      description="List of your runtime executions"
    />
  );
};

export const RuntimeExecutionsList = () => {
  const rExecs = useSuspenseRuntimeExecutions();

  return (
    <EntityList
      items={rExecs.data.items}
      getKey={(rExec) => rExec.id}
      emptyView={<RuntimeExecutionEmpty />}
      renderItem={(rExecs) => <RuntimeExecutionItem data={rExecs} />}
    />
  );
};

export const RuntimeExecutionsPagination = () => {
  const rExecs = useSuspenseRuntimeExecutions();
  const [params, setParams] = useRuntimeExecutionsParams();

  return (
    <EntityPagination
      disabled={rExecs.isFetching}
      page={rExecs.data.page}
      totalPages={rExecs.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const RuntimeExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<RuntimeExecutionsHeader />}
      pagination={<RuntimeExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const RuntimeExecutionLoading = () => (
  <LoadingView message="Loading Runtime Executions..." />
);

export const RuntimeExecutionError = () => (
  <ErrorView message="Error loading Runtime Executions." />
);

export const RuntimeExecutionEmpty = () => {
  return (
    <EmptyView message="You have no Runtime Executions yet. Get started by creating your first Workflow and run it." />
  );
};

export const RuntimeExecutionItem = ({
  data,
}: {
  data: Execution & { workflow: { id: string; name: string } };
}) => {
  const duration = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000,
      )
    : null;

  const subtitle = (
    <>
      {data.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}
      {duration !== null ? <> &bull; Took {duration}s</> : null}
    </>
  );

  const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
      case ExecutionStatus.SUCCESS:
        return <CheckCircle2Icon className="size-5 text-green-500" />;
      case ExecutionStatus.FAILED:
        return <XCircleIcon className="size-5 text-red-500" />;
      case ExecutionStatus.RUNNING:
        return <Loader2Icon className="size-5 text-blue-500 animate-spin" />;
      default:
        <ClockIcon className="size-5 text-blue-500" />;
    }
  };

  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={`${data.status} (WorkflowId: ${data.workflowId})`}
      subtitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  );
};
