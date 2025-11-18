"use server";

import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export async function fetchStripeTriggerRealtimeToken(): Promise<
  Realtime.Token<typeof stripeTriggerChannel, ["status"]>
> {
  const token = await getSubscriptionToken(inngest, {
    channel: stripeTriggerChannel(),
    topics: ["status"],
  });
  return token;
}
