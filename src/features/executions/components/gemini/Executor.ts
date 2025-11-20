import type { NodeExecutor } from "@/features/executions/ExecutorRegistry";
import type { GeminiNodeData } from "./Node";
import Handlebars from "handlebars";
import type { Realtime } from "@inngest/realtime";
import type { NodeStatus } from "@/components/react-flow/NodeStatusIndicator";
import { geminiRequestChannel } from "@/inngest/channels/gemini";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/prisma";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

const publishStatus =
  (publish: Realtime.PublishFn) =>
  async (nodeId: string, status: NodeStatus) => {
    await publish(
      geminiRequestChannel().status({
        nodeId,
        status,
      }),
    );
  };

export const geminiExecutor: NodeExecutor<GeminiNodeData> = async ({
  nodeId,
  data,
  userId,
  context,
  step,
  publish,
}) => {
  try {
    if (!data.variableName) {
      await publishStatus(publish)(nodeId, "error");
      throw new NonRetriableError(
        "[GeminiExecutor]: Variable name not configured",
      );
    }
    if (!data.credentialId) {
      await publishStatus(publish)(nodeId, "error");
      throw new NonRetriableError(
        "[GeminiExecutor]: Credential not configured",
      );
    }
    if (!data.userPrompt) {
      await publishStatus(publish)(nodeId, "error");
      throw new NonRetriableError(
        "[GeminiExecutor]: User prompt not configured",
      );
    }

    await publishStatus(publish)(nodeId, "loading");

    const systemPrompt = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : "You are a helpful assistant";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    const credential = await step.run("get-credential", () => {
      return prisma.credential.findUnique({
        where: { id: data.credentialId, userId },
      });
    });

    if (!credential) {
      throw new NonRetriableError("[GeminiExecutor]: Credential not found");
    }

    const google = createGoogleGenerativeAI({
      apiKey: credential.value,
    });

    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google(data.model),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publishStatus(publish)(nodeId, "success");

    return {
      ...context,
      [data.variableName]: text,
    };
  } catch (error) {
    await publishStatus(publish)(nodeId, "error");
    throw error;
  }
};
