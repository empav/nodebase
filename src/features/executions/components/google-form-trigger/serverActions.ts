"use server";

import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export async function fetchGoogleFormTriggerRealtimeToken(): Promise<
  Realtime.Token<typeof googleFormTriggerChannel, ["status"]>
> {
  const token = await getSubscriptionToken(inngest, {
    channel: googleFormTriggerChannel(),
    topics: ["status"],
  });
  return token;
}
