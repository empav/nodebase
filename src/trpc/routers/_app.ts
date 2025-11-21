import { createTRPCRouter } from "../init";
import { credentialsRouter } from "./credentials";
import { runtimeExecutionsRouter } from "./runtimeExecutions";
import { usersRouter } from "./users";
import { workflowsRouter } from "./workflows";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  runtimeExecutions: runtimeExecutionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
