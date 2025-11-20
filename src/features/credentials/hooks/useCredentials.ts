import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import useCredentialsParams from "./useCredentialsParams";
import type { CredentialType } from "@prisma/client";

export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.findOne.queryOptions({ id }));
};

export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();

  return useSuspenseQuery(trpc.credentials.findMany.queryOptions(params));
};

export const useFindCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC();
  return useQuery(trpc.credentials.findByType.queryOptions({ type }));
};

export const useCreateOneCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.createOne.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Credential ${data.name} created`);
        queryClient.invalidateQueries(
          trpc.credentials.findMany.queryOptions({}),
        );
      },
      onError: (error) => {
        toast.error(`Error creating credential: ${error.message}`);
      },
    }),
  );
};

export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Credential ${data.name} saved`);
        queryClient.invalidateQueries(
          trpc.credentials.findMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.findOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Error creating Credential: ${error.message}`);
      },
    }),
  );
};

export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.removeOne.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Credential ${data.name} removed`);
        queryClient.invalidateQueries(
          trpc.credentials.findMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.findOne.queryFilter({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Error creating credential: ${error.message}`);
      },
    }),
  );
};
