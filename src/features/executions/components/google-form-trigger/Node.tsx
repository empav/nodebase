"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../BaseTriggerNode";
import { GoogleFormTriggerDialog } from "./Dialog";
import useNodeStatus from "../../hooks/useNodeStatus";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";
import { fetchGoogleFormTriggerRealtimeToken } from "./serverActions";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);

  const status = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });

  const onSettings = () => setOpen(true);

  return (
    <>
      <GoogleFormTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logos/googleform.svg"
        name="Google Form"
        description="Listening for a Google Form to be submitted"
        showToolbar
        status={status}
        onSettings={onSettings}
        onDoubleClick={onSettings}
      />
    </>
  );
});

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";

export default GoogleFormTriggerNode;
