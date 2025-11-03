import { requireAuth } from "@/lib/auth-utils";

type Props = {
  params: Promise<{ executionId: string }>;
};

export default async function Page({ params }: Props) {
  await requireAuth();
  const { executionId } = await params;
  return <p>Executions: {executionId}</p>;
}
