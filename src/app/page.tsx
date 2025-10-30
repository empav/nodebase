import { Button } from "@/components/ui/button";
import User from "@/features/home/components/User";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const queryClient = getQueryClient();

export default async function Home() {
  void queryClient.prefetchQuery(trpc.users.findMany.queryOptions());
  return (
    <div className="text-red-500">
      <Button>Click me</Button>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <User />
      </HydrationBoundary>
    </div>
  );
}
