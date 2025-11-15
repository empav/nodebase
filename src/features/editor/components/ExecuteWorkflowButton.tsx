import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/useWorkflows";
import { FlaskConicalIcon } from "lucide-react";

const ExecuteWorkflowButton = ({ workflowId }: { workflowId: string }) => {
  const exec = useExecuteWorkflow();
  return (
    <Button
      size={"lg"}
      onClick={() => exec.mutate({ id: workflowId })}
      disabled={exec.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      Execute Workfow
    </Button>
  );
};

export default ExecuteWorkflowButton;
