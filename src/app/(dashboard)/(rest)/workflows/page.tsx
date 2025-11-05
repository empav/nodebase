import {
  WorkflowContainer,
  WorkflowError,
  WorkflowLoading,
  WorkflowsList,
} from "@/features/workflows/components/Workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { createLoader } from "nuqs/server";
import { params } from "@/features/workflows/server/params";

type Props = {
  searchParams: Promise<SearchParams>;
};

const workflowsParamsLoader = createLoader(params);

export default async function Page({ searchParams }: Props) {
  await requireAuth();

  const params = await workflowsParamsLoader(searchParams);

  prefetchWorkflows(params);

  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowError />}>
          <Suspense fallback={<WorkflowLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
}
