"use client";

import { formatDistanceToNow } from "date-fns";
import { useSuspenseRuntimeExecution } from "../hooks/useRuntimeExecutions";
import { ExecutionStatus } from "@prisma/client";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="size-5 text-green-500" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-500" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-500 animate-spin" />;
    default:
      <ClockIcon className="size-5 text-blue-500" />;
  }
};

export const RuntimeExecutionView = ({
  executionId,
}: {
  executionId: string;
}) => {
  const { data: execution } = useSuspenseRuntimeExecution(executionId);
  const [showStack, setShowStack] = useState(false);

  const duration = execution.completedAt
    ? Math.round(
        (new Date(execution.completedAt).getTime() -
          new Date(execution.startedAt).getTime()) /
          1000,
      )
    : null;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getStatusIcon(execution.status)}
          <div>
            <CardTitle>{execution.status}</CardTitle>
            <CardDescription>
              Execution for {execution.workflow.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Workflow
            </p>
            <Link
              href={`/workflows/${execution.workflowId}`}
              prefetch
              className="text-sm hover:underline text-primary"
            >
              {execution.workflow.name}
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">{execution.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Started</p>
            <p className="text-sm">
              {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
            </p>
          </div>
          {execution.completedAt ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-sm">
                {formatDistanceToNow(execution.completedAt, {
                  addSuffix: true,
                })}
              </p>
            </div>
          ) : null}
          {duration ? (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="text-sm">{duration}s</p>
            </div>
          ) : null}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Event Id
            </p>
            <p className="text-sm">{execution.inngestEventId}s</p>
          </div>
        </div>
        {execution.error ? (
          <div className="mt-6 p-4 bg-red-50 rounded-md space-y-3">
            <div>
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm font-mono text-red-800">
                {execution.error}
              </p>
            </div>
            {execution.errorStack ? (
              <Collapsible open={showStack} onOpenChange={setShowStack}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size="sm"
                    className="text-red-900 hover:bg-red-100"
                  >
                    {showStack ? "Hide Stack Trace" : "Show Stack Trace"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="text-sm font-mono text-red-800 overflow-auto mt-2 p-2 bg-red-100 rounded">
                    {execution.errorStack}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            ) : null}
          </div>
        ) : null}
        {execution.output ? (
          <div className="mt-6 p-4 bg-muted rounded-md ">
            <p className="text-sm font-medium mb-2">Output</p>
            <pre className="text-xs font-mono overflow-auto">
              {JSON.stringify(execution.output, null, 2)}
            </pre>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
