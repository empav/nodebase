import { redirect } from "next/navigation";
import { auth } from "./auth";
import { headers } from "next/headers";

const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
};

const requireUnAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
};

export { requireAuth, requireUnAuth };
