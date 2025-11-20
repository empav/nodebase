import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/prisma";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { CredentialType } from "@prisma/client";

export const credentialsRouter = createTRPCRouter({
  createOne: premiumProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        type: z.enum(CredentialType),
        value: z.string().min(1, { message: "Value is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.credential.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
    }),

  removeOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.credential.delete({
        where: { userId: ctx.user.id, id: input.id },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, { message: "Name is required" }),
        type: z.enum(CredentialType),
        value: z.string().min(1, { message: "Value is required" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.credential.update({
        where: { id: input.id, userId: ctx.user.id },
        data: {
          ...input,
        },
      });
    }),

  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await prisma.credential.findUniqueOrThrow({
        where: { userId: ctx.user.id, id: input.id },
      });
    }),

  findMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.credential.count({
          where: {
            userId: ctx.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      };
    }),

  findByType: protectedProcedure
    .input(z.object({ type: z.enum(CredentialType) }))
    .query(({ ctx, input }) => {
      return prisma.credential.findMany({
        where: { userId: ctx.user.id, type: input.type },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});

export type CredentialsRouter = typeof credentialsRouter;
