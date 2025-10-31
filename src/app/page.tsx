import User from "@/features/home/components/User";
import { requireAuth } from "@/lib/auth-utils";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const queryClient = getQueryClient();

export default async function Home() {
  await requireAuth();
  void queryClient.prefetchQuery(trpc.users.findMany.queryOptions());
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <User />
      </HydrationBoundary>
    </div>
  );
}
