import { createTRPCRouter } from "../init";
import { usersRouter } from "./users";
import { workflowsRouter } from "./workflows";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  workflows: workflowsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
