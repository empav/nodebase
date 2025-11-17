import type { Connection, Node } from "@prisma/client";
import toposort from "toposort";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  if (connections.length === 0) return nodes;

  const edges: [string, string][] = connections.map((c) => [
    c.fromNodeId,
    c.toNodeId,
  ]);

  const connectedNodeIds = new Set<string>();

  for (const c of connections) {
    connectedNodeIds.add(c.fromNodeId);
    connectedNodeIds.add(c.toNodeId);
  }

  for (const n of nodes) {
    if (!connectedNodeIds.has(n.id)) {
      edges.push([n.id, n.id]);
    }
  }

  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }
    throw Error;
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // biome-ignore lint/style/noNonNullAssertion: <always there>
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
