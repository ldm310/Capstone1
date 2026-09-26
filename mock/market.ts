import type { MarketDataset, RoleId } from "@/types/career";
import { skills } from "./skills";
function dataset(
  ids: string[],
  demands: number[],
  changes: number[],
  total: number,
  relationships: string[][],
): MarketDataset {
  const ranking = ids.map((skillId, i) => ({
    skillId,
    name: skills.find((s) => s.id === skillId)!.name,
    demand: demands[i],
    change: changes[i],
  }));
  return {
    skills: ranking,
    total,
    relationships,
    trend: ["4월", "5월", "6월", "7월", "8월", "9월"].map((month, i) =>
      Object.fromEntries([
        ["month", month],
        ...ranking
          .slice(0, 3)
          .map((s) => [
            s.name,
            Math.max(1, s.demand - (s.change * (5 - i)) / 3),
          ]),
      ]),
    ) as MarketDataset["trend"],
  };
}
export const market: Record<RoleId, MarketDataset> = {
  ax: dataset(
    [
      "rag",
      "langchain",
      "docker",
      "vector",
      "langgraph",
      "mcp",
      "python",
      "api",
      "git",
      "embedding",
      "evaluation",
    ],
    [61, 48, 43, 38, 31, 24, 23, 20, 17, 16, 12],
    [5, 3, 1, 6, 8, 13, 1, 2, 0, 4, 3],
    387,
    [
      ["RAG", "Vector DB", "Embedding", "Hybrid Search", "Reranking"],
      ["Agent", "LangGraph", "Tool Calling", "MCP"],
    ],
  ),
  ml: dataset(
    ["python", "pytorch", "docker", "kubernetes", "mlflow", "evaluation"],
    [82, 68, 51, 39, 34, 29],
    [2, 5, 1, 7, 9, 6],
    264,
    [
      ["Training", "PyTorch", "Evaluation", "MLflow"],
      ["Serving", "Docker", "Kubernetes"],
    ],
  ),
  data: dataset(
    ["sql", "python", "spark", "airflow", "aws", "docker"],
    [86, 73, 56, 49, 43, 35],
    [1, 2, 5, 8, 4, 1],
    312,
    [
      ["Ingestion", "Airflow", "Spark", "SQL"],
      ["Platform", "AWS", "Docker"],
    ],
  ),
};
