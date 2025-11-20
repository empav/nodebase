import {
  CredentialContainer,
  CredentialError,
  CredentialLoading,
  CredentialsList,
} from "@/features/credentials/components/Credentials";
import { params } from "@/features/credentials/server/params";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
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

  prefetchCredentials(params);

  return (
    <CredentialContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialError />}>
          <Suspense fallback={<CredentialLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialContainer>
  );
}
