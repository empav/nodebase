"use client";

import type { NodeProps } from "@xyflow/react";
import { memo } from "react";
import BaseTriggerNode from "../BaseTriggerNode";
import { MousePointerIcon } from "lucide-react";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      icon={MousePointerIcon}
      name="When clicking Execute workflow"
      showToolbar
    />
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";

export default ManualTriggerNode;
