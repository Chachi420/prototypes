import { createFileRoute } from "@tanstack/react-router";
import BacklogGroomingAgent from "@/components/BacklogGroomingAgent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Backlog Grooming Agent" },
      { name: "description", content: "AI-powered backlog grooming: review duplicates, stale tasks, priority changes, and rewrites." },
    ],
  }),
  component: Index,
});

function Index() {
  return <BacklogGroomingAgent />;
}
