"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  useSuspenseWorkflow,
  useUpdateNameWorkflow,
} from "@/features/workflows/hooks/useWorkflows";
import { SaveIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const EditorSaveButton = ({ workflowId }: { workflowId: string }) => (
  <div className="ml-auto">
    <Button size={"sm"} onClick={() => {}} disabled={false}>
      <SaveIcon className="size-4" />
      Save
    </Button>
  </div>
);

const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflow = useUpdateNameWorkflow();

  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState(workflow.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow.name) setName(workflow.name);
  }, [workflow.name]);
  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEdit]);

  const onSave = async () => {
    setIsEdit(false);
    if (name === workflow.name) {
      return;
    }
    try {
      await updateWorkflow.mutateAsync({ id: workflow.id, name });
    } catch {
      setName(workflow.name);
    } finally {
      setIsEdit(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSave();
      return;
    }
    if (e.key === "Escape") {
      setName(workflow.name);
      setIsEdit(false);
    }
  };

  if (isEdit)
    return (
      <Input
        disabled={updateWorkflow.isPending}
        ref={inputRef}
        value={name}
        onBlur={onSave}
        onKeyDown={onKeyDown}
        onChange={(e) => setName(e.target.value)}
        className="h-7 w-auto min-w-[100px] px-2"
      />
    );

  return (
    <BreadcrumbItem
      onClick={() => setIsEdit(true)}
      className="cursor-pointer hover:text-foreground transition-colors"
    >
      {workflow.name}
    </BreadcrumbItem>
  );
};

const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/workflows"}>Workflows</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="flex items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
};

export default EditorHeader;
