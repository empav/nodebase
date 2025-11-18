import { NodeType } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";
import { EXEC_NODES, TRIGGER_NODES } from "@/config/constants";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

const NodeSelector = ({ open, onOpenChange, children }: Props) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const onNodeSelect = useCallback(
    (selected: NodeTypeOption) => {
      if (selected.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER,
        );
        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed per workflow");
          return;
        }
      }
      setNodes((nodes) => {
        const hasInitialNode = nodes.some((n) => n.type === NodeType.INITIAL);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });
        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selected.type,
        };
        if (hasInitialNode) {
          return [newNode];
        }
        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [getNodes, setNodes, onOpenChange, screenToFlowPosition],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step to start your workflow.
          </SheetDescription>
        </SheetHeader>
        <div>
          {TRIGGER_NODES.map((tn) => {
            const Icon = tn.icon;
            return (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <tobeexplained>
              // biome-ignore lint/a11y/noStaticElementInteractions: <tobeexplained>
              <div
                key={tn.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                onClick={() => onNodeSelect(tn)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    // biome-ignore lint/performance/noImgElement: <tobeexplained>
                    <img
                      src={Icon}
                      alt={tn.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{tn.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {tn.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Separator />
        <div>
          {EXEC_NODES.map((tn) => {
            const Icon = tn.icon;
            return (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <tobeexplained>
              // biome-ignore lint/a11y/noStaticElementInteractions: <tobeexplained>
              <div
                key={tn.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                onClick={() => onNodeSelect(tn)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    // biome-ignore lint/performance/noImgElement: <tobeexplained>
                    <img
                      src={Icon}
                      alt={tn.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{tn.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {tn.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NodeSelector;
