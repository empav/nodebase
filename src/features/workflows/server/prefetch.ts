import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type FindManyInput = inferInput<typeof trpc.workflows.findMany>;

export const prefetchWorkflows = (params: FindManyInput) => {
  return prefetch(trpc.workflows.findMany.queryOptions(params));
};
