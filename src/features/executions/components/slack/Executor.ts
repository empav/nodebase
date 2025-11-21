import type { NodeExecutor } from "@/features/executions/ExecutorRegistry";
import type { SlackNodeData } from "./Node";
import Handlebars from "handlebars";
import type { Realtime } from "@inngest/realtime";
import type { NodeStatus } from "@/components/react-flow/NodeStatusIndicator";
import { slackRequestChannel } from "@/inngest/channels/slack";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

const publishStatus =
  (publish: Realtime.PublishFn) =>
  async (nodeId: string, status: NodeStatus) => {
    await publish(
      slackRequestChannel().status({
        nodeId,
        status,
      }),
    );
  };

export const slackExecutor: NodeExecutor<SlackNodeData> = async ({
  nodeId,
  data,
  context,
  step,
  publish,
}) => {
  try {
    if (!data.variableName) {
      throw new NonRetriableError(
        "[SlackExecutor]: Variable name not configured",
      );
    }
    if (!data.content) {
      throw new NonRetriableError("[SlackExecutor]: Content not configured");
    }
    if (!data.webhookUrl) {
      throw new NonRetriableError("[SlackExecutor]: Webhook not configured");
    }

    await publishStatus(publish)(nodeId, "loading");

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);

    const result = await step.run("slack-execution", async () => {
      await ky.post(data.webhookUrl, {
        json: {
          content,
        },
      });
      return {
        ...context,
        [data.variableName]: content,
      };
    });

    await publishStatus(publish)(nodeId, "success");

    return result;
  } catch (error) {
    await publishStatus(publish)(nodeId, "error");
    throw error;
  }
};
