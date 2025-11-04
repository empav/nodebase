import {
  WorkflowContainer,
  WorkflowsList,
} from "@/features/workflows/components/Workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Page() {
  await requireAuth();

  prefetchWorkflows();

  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Failed to load workflows.</p>}>
          <Suspense fallback={<p>Loading workflows...</p>}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
}
