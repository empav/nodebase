import { Button } from "@/components/ui/button";
import { caller } from "@/trpc/server";

export default async function Home() {
  const users = await caller.getUsers();
  return (
    <div className="text-red-500">
      <Button>Click me</Button>
      <pre>{JSON.stringify(users)}</pre>
    </div>
  );
}
