"use server";

import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export async function fetchManualTriggerRealtimeToken(): Promise<
  Realtime.Token<typeof manualTriggerChannel, ["status"]>
> {
  const token = await getSubscriptionToken(inngest, {
    channel: manualTriggerChannel(),
    topics: ["status"],
  });
  return token;
}
