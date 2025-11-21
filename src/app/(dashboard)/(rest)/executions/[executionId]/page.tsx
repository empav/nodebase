import { RuntimeExecutionView } from "@/features/runtime-executions/components/RuntimeExecution";
import {
  RuntimeExecutionError,
  RuntimeExecutionLoading,
} from "@/features/runtime-executions/components/RuntimeExecutions";
import { prefetchRuntimeExecution } from "@/features/runtime-executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  params: Promise<{ executionId: string }>;
};

export default async function Page({ params }: Props) {
  await requireAuth();

  const { executionId } = await params;
  prefetchRuntimeExecution(executionId);

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<RuntimeExecutionError />}>
            <Suspense fallback={<RuntimeExecutionLoading />}>
              <RuntimeExecutionView executionId={executionId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
}
