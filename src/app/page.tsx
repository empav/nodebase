import User from "@/features/home/components/User";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const queryClient = getQueryClient();

export default async function Home() {
  void queryClient.prefetchQuery(trpc.users.findMany.queryOptions());
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <User />
      </HydrationBoundary>
    </div>
  );
}
