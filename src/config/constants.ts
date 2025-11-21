import type { NodeTypeOption } from "@/components/react-flow/NodeSelector";
import { NodeType } from "@prisma/client";
import { GlobeIcon, MousePointerIcon } from "lucide-react";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 5,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
};

export const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-pro"] as const;

export const EXEC_NODES: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "Http request",
    description: "Makes a HTTP request.",
    icon: GlobeIcon,
  },
] as const;

export const TRIGGER_NODES: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Runs flow when clicking a button. Good for getting started quickly",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs flow when a Google Form is submitted",
    icon: "/logos/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe",
    description: "Runs flow when a Stripe event is captured",
    icon: "/logos/stripe.svg",
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Use Gemini to generate text",
    icon: "/logos/gemini.svg",
  },
  {
    type: NodeType.SLACK,
    label: "Slack",
    description: "Send a message to Slack",
    icon: "/logos/slack.svg",
  },
] as const;
