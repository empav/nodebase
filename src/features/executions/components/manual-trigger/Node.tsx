"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../BaseTriggerNode";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./Dialog";
import useNodeStatus from "../../hooks/useNodeStatus";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerRealtimeToken } from "./serverActions";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  const status = useNodeStatus({
    nodeId: props.id,
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchManualTriggerRealtimeToken,
  });

  const onSettings = () => setOpen(true);

  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="Manual trigger"
        description="Clicking Execute workflow"
        showToolbar
        status={status}
        onSettings={onSettings}
        onDoubleClick={onSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";

export default ManualTriggerNode;
