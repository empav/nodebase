"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "../ui/button";
import { SettingsIcon, TrashIcon } from "lucide-react";

type WorkflowNodeProps = {
  children: React.ReactNode;
  showToolbar?: boolean;
  onDeleteAction?: () => void;
  onSettingsAction?: () => void;
  name?: string;
  description?: string;
};

export function WorkflowNode({
  children,
  showToolbar,
  onDeleteAction,
  onSettingsAction,
  name,
  description,
}: WorkflowNodeProps) {
  return (
    <>
      {showToolbar ? (
        <NodeToolbar>
          <Button size={"sm"} variant={"ghost"} onClick={onSettingsAction}>
            <SettingsIcon />
          </Button>
          <Button size={"sm"} variant={"ghost"} onClick={onDeleteAction}>
            <TrashIcon />
          </Button>
        </NodeToolbar>
      ) : null}
      {children}
      {name ? (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-[200px] text-center"
        >
          <p className="font-medium">{name}</p>
          {description ? (
            <p className="text-muted-foreground truncate text-sm">
              {description}
            </p>
          ) : null}
        </NodeToolbar>
      ) : null}
    </>
  );
}
