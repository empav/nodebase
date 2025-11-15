"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../BaseTriggerNode";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./Dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  const onSettings = () => setOpen(true);

  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking Execute workflow"
        showToolbar
        status={"initial"}
        onSettings={onSettings}
        onDoubleClick={onSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";

export default ManualTriggerNode;
