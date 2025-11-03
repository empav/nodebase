"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useQuery(trpc.workflows.findMany.queryOptions());

  const createWorkflow = useMutation(
    trpc.workflows.createOne.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.workflows.findMany.queryOptions());
        toast.success(data.message);
      },
    }),
  );

  return (
    <div>
      <Button
        disabled={createWorkflow.isPending}
        onClick={() => createWorkflow.mutate()}
      >
        Create Workflow
      </Button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
