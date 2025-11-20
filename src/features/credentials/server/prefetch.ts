import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type FindManyInput = inferInput<typeof trpc.credentials.findMany>;

export const prefetchCredentials = (params: FindManyInput) => {
  return prefetch(trpc.credentials.findMany.queryOptions(params));
};

export const prefetchCredential = (id: string) => {
  return prefetch(trpc.credentials.findOne.queryOptions({ id }));
};
