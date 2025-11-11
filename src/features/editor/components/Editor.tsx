"use client";

import { ErrorView, LoadingView } from "@/components/EntityComponents";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/useWorkflows";

export const EditorLoading = () => <LoadingView message="Loading Editor..." />;

export const EditorError = () => <ErrorView message="Error loading Editor." />;

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  return <p>{JSON.stringify(workflow, null, 2)}</p>;
};
