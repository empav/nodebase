import type { NodeExecutor } from "@/features/executions/ExecutorRegistry";
import type { HttpRequestNodeData } from "./Node";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import type { Realtime } from "@inngest/realtime";
import type { NodeStatus } from "@/components/react-flow/NodeStatusIndicator";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

const publishStatus =
  (publish: Realtime.PublishFn) =>
  async (nodeId: string, status: NodeStatus) => {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status,
      }),
    );
  };

export const httpRequestExecutor: NodeExecutor<HttpRequestNodeData> = async ({
  nodeId,
  data,
  context,
  step,
  publish,
}) => {
  try {
    await publishStatus(publish)(nodeId, "loading");

    if (!data.variableName) {
      throw new NonRetriableError(
        "[HttpRequestExecutor]: No variable name configured",
      );
    }
    if (!data.endpoint) {
      throw new NonRetriableError(
        "[HttpRequestExecutor]: No endopoint configured",
      );
    }
    if (!data.method) {
      throw new NonRetriableError(
        "[HttpRequestExecutor]: No method configured",
      );
    }
    return await step.run("http-request", async () => {
      const endpoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method || "GET";
      const options: Options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (method !== "GET") {
        const resolved = Handlebars.compile(data.body)(context);
        JSON.parse(resolved);
        options.body = resolved;
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      await publishStatus(publish)(nodeId, "success");

      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    });
  } catch (error) {
    await publishStatus(publish)(nodeId, "error");
    throw error;
  }
};
