import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import useWorkflowsParams from "./useWorkflowsParams";

export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.findOne.queryOptions({ id }));
};

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();

  return useSuspenseQuery(trpc.workflows.findMany.queryOptions(params));
};

export const useCreateOneWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.createOne.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Workflow ${data.name} created`);
        queryClient.invalidateQueries(trpc.workflows.findMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Error creating workflow: ${error.message}`);
      },
    }),
  );
};

export const useUpdateNameWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Workflow ${data.name} created`);
        queryClient.invalidateQueries(trpc.workflows.findMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.findOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Error creating workflow: ${error.message}`);
      },
    }),
  );
};

export const useUpdateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Workflow ${data.name} saved`);
        queryClient.invalidateQueries(trpc.workflows.findMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.findOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Error creating workflow: ${error.message}`);
      },
    }),
  );
};

export const useExecuteWorkflow = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.execute.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Workflow ${data.name} executed`);
      },
      onError: (error) => {
        toast.error(`Error executing workflow: ${error.message}`);
      },
    }),
  );
};

export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.removeOne.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Workflow ${data.name} removed`);
        queryClient.invalidateQueries(trpc.workflows.findMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.findOne.queryFilter({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Error creating workflow: ${error.message}`);
      },
    }),
  );
};
