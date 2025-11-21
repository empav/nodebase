"use server";

import { slackRequestChannel } from "@/inngest/channels/slack";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type SlackToken = Realtime.Token<typeof slackRequestChannel, ["status"]>;

export async function fetchSlackRealtimeToken(): Promise<SlackToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: slackRequestChannel(),
    topics: ["status"],
  });
  return token;
}
