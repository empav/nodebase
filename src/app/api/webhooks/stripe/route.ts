import { sendWorkflowExecution } from "@/inngest/utils";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json({
        success: false,
        error: "Query Parameter workflowId is required",
        status: 400,
      });
    }

    const body = await req.json();

    const stripe = {
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
    };

    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe,
      },
    });

    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    console.error("Google from webhook error: ", error);
    return NextResponse.json({
      success: false,
      error: "Failed to process google form submission",
      status: 500,
    });
  }
}
