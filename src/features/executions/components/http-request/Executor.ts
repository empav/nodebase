import type { NodeExecutor } from "@/features/executions/ExecutorRegistry";
import type { HttpRequestNodeData } from "./Node";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky";
import Handlebars from "handlebars";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

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

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });
};
