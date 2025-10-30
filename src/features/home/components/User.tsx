"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const User = () => {
  const trpc = useTRPC();
  const { data, isFetching } = useQuery(trpc.users.findMany.queryOptions());

  if (isFetching) return <div>Loading...</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default User;
