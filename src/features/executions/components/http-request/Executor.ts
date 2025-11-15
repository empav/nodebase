import type { NodeExecutor } from "@/features/executions/ExecutorRegistry";
import type { HttpRequestNodeData } from "./Node";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky";

export const HttpRequestExecutor: NodeExecutor<HttpRequestNodeData> = async ({
  data,
  context,
  step,
}) => {
  if (!data.variableName) {
    throw new NonRetriableError("[Http request]: Variable name not configured");
  }
  if (!data.endpoint) {
    throw new NonRetriableError("[Http request]: No endopoint configured");
  }
  if (!data.method) {
    throw new NonRetriableError("[Http request]: No method configured");
  }

  return await step.run("http-request", async () => {
    const method = data.method || "GET";

    const options: Options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (["POST", "PATCH", "PUT", "DELETE"].includes(method)) {
      options.body = data.body;
    }

    const response = await ky(data.endpoint, options);
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

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });
};
