import {
  RuntimeExecutionsContainer,
  RuntimeExecutionError,
  RuntimeExecutionLoading,
  RuntimeExecutionsList,
} from "@/features/runtime-executions/components/RuntimeExecutions";
import { params } from "@/features/runtime-executions/server/params";
import { prefetchRuntimeExecutions } from "@/features/runtime-executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { createLoader, type SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const loader = createLoader(params);

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: Props) {
  await requireAuth();
  const params = await loader(searchParams);

  prefetchRuntimeExecutions(params);

  return (
    <RuntimeExecutionsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<RuntimeExecutionError />}>
          <Suspense fallback={<RuntimeExecutionLoading />}>
            <RuntimeExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </RuntimeExecutionsContainer>
  );
}
