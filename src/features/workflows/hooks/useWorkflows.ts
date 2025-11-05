import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import useWorkflowsParams from "./useWorkflowsParams";

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
