"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../BaseTriggerNode";
import { StripeTriggerDialog } from "./Dialog";
import useNodeStatus from "../../hooks/useNodeStatus";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";
import { fetchStripeTriggerRealtimeToken } from "./serverActions";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  const status = useNodeStatus({
    nodeId: props.id,
    channel: STRIPE_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchStripeTriggerRealtimeToken,
  });

  const onSettings = () => setOpen(true);

  return (
    <>
      <StripeTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logos/stripe.svg"
        name="Stripe"
        description="When a Stripe event is captured"
        showToolbar
        status={status}
        onSettings={onSettings}
        onDoubleClick={onSettings}
      />
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";

export default StripeTriggerNode;
