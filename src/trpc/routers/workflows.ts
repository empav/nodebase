import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma/enums";
import type { Node, Edge } from "@xyflow/react";

export const workflowsRouter = createTRPCRouter({
  createOne: premiumProcedure.mutation(async ({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.user.id,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      },
    });
  }),

  removeOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.workflow.delete({
        where: { userId: ctx.user.id, id: input.id },
      });
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(3) }))
    .mutation(async ({ ctx, input }) => {
      return prisma.workflow.update({
        where: { userId: ctx.user.id, id: input.id },
        data: { name: input.name },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional(),
          }),
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;

      const workflow = prisma.workflow.findUniqueOrThrow({
        where: { id, userId: ctx.user.id },
      });

      return await prisma.$transaction(async (tx) => {
        await tx.node.deleteMany({
          where: { worflowId: id },
        });
        await tx.node.createMany({
          data: nodes.map((n) => ({
            id: n.id,
            worflowId: id,
            name: n.type || "unknown",
            type: n.type as NodeType,
            position: n.position,
            data: n.data || {},
          })),
        });
        await tx.connection.createMany({
          data: edges.map((e) => ({
            worflowId: id,
            fromNodeId: e.source,
            toNodeId: e.target,
            fromOutput: e.sourceHandle || "main",
            toInput: e.targetHandle || "main",
          })),
        });

        await tx.workflow.update({
          where: { id },
          data: { updatedAt: new Date() },
        });

        return workflow;
      });
    }),

  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ws = await prisma.workflow.findUniqueOrThrow({
        where: { userId: ctx.user.id, id: input.id },
        include: { nodes: true, connections: true },
      });
      const nodes: Node[] = ws.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));
      const edges: Edge[] = ws.connections.map((c) => ({
        id: c.id,
        source: c.fromNodeId,
        target: c.toNodeId,
        sourceHandle: c.fromOutput,
        targetHandle: c.toInput,
        worflowId: c.worflowId,
      }));
      return {
        id: ws.id,
        name: ws.name,
        nodes,
        edges,
      };
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
        prisma.workflow.findMany({
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
        prisma.workflow.count({
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

  execute: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ws = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      await inngest.send({
        name: "workflows/execute.workflow",
        data: {
          workflowId: input.id,
        },
      });
      return ws;
    }),
});

export type WorkflowsRouter = typeof workflowsRouter;
