import InitialNode from "@/components/react-flow/InitialNode";
import GoogleFormTriggerNode from "@/features/executions/components/google-form-trigger/Node";
import HttpRequestNode from "@/features/executions/components/http-request/Node";
import ManualTriggerNode from "@/features/executions/components/manual-trigger/Node";
import StripeTriggerNode from "@/features/executions/components/stripe-trigger/Node";
import { NodeType } from "@prisma/client";
import type { NodeTypes } from "@xyflow/react";

export const nodeTypes = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeTypes;
