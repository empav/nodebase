import { createTRPCRouter } from "../init";
import { usersRouter } from "./users";

export const appRouter = createTRPCRouter({
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
