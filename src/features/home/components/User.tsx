"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { redirect } from "next/navigation";

const User = () => {
  const trpc = useTRPC();
  const { data, isFetching } = useQuery(trpc.users.findMany.queryOptions());

  const {
    data: session,
    isPending, //loading state
  } = authClient.useSession();

  if (isFetching || isPending) return <div>Loading...</div>;

  if (!session) redirect("/");

  return (
    <div>
      <div>User logged in: {session?.user.email}</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {session?.user.email ? (
        <Button onClick={() => authClient.signOut()}>Sign out</Button>
      ) : (
        <Link href={"/login"}>Login</Link>
      )}
    </div>
  );
};

export default User;
