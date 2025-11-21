import { prefetch, trpc } from "@/trpc/server";
import type { inferInput, inferOutput } from "@trpc/tanstack-react-query";

type FindManyInput = inferInput<typeof trpc.runtimeExecutions.findMany>;
export type FindOneOutput = inferOutput<typeof trpc.runtimeExecutions.findOne>;

export const prefetchRuntimeExecutions = (params: FindManyInput) => {
  return prefetch(trpc.runtimeExecutions.findMany.queryOptions(params));
};

export const prefetchRuntimeExecution = (id: string) => {
  return prefetch(trpc.runtimeExecutions.findOne.queryOptions({ id }));
};
