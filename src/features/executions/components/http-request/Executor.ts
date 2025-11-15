import type { NodeExecutor } from "@/features/executions/ExecutorRegistry";
import type { HttpRequestNodeData } from "./Node";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky";

export const HttpRequestExecutor: NodeExecutor<HttpRequestNodeData> = async ({
  data,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("[Http request]: No endopoint configured");
  }

  const result = await step.run("http-request", async () => {
    // biome-ignore lint/style/noNonNullAssertion: <see line 13-14-15>
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const options: Options = {
      method,
    };
    if (["POST", "PATCH", "PUT", "DELETE"].includes(method)) {
      options.body = data.body;
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  return result;
};
