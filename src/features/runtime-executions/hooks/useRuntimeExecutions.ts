import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import useRuntimeExecutionParams from "./useRuntimeExecutionParams";

export const useSuspenseRuntimeExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.runtimeExecutions.findOne.queryOptions({ id }));
};

export const useSuspenseRuntimeExecutions = () => {
  const trpc = useTRPC();
  const [params] = useRuntimeExecutionParams();

  return useSuspenseQuery(trpc.runtimeExecutions.findMany.queryOptions(params));
};
