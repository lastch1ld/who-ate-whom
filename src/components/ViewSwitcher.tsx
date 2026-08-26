"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Industry } from "@/data/types";
import RiverView from "@/components/views/RiverView";
import TreeView from "@/components/views/TreeView";
import BubbleView from "@/components/views/BubbleView";

const VIEWS = [
  { id: "river", label: "River" },
  { id: "tree", label: "Tree" },
  { id: "bubbles", label: "Bubbles" },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export default function ViewSwitcher({ industry }: { industry: Industry }) {
  const [view, setView] = useState<ViewId>("river");

  return (
    <div>
      <div className="mb-5 inline-flex gap-1 rounded-sm border border-rule bg-surface-muted p-1">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className="relative rounded-sm px-3 py-1.5 font-mono text-[12px] uppercase tracking-wide text-ink-muted transition-colors data-[active=true]:text-ink"
            data-active={view === v.id}
          >
            {view === v.id && (
              <motion.span
                layoutId="view-switcher-highlight"
                className="absolute inset-0 rounded-sm bg-surface shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{v.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={view}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {view === "river" && <RiverView industry={industry} />}
        {view === "tree" && <TreeView industry={industry} />}
        {view === "bubbles" && <BubbleView industry={industry} />}
      </motion.div>
    </div>
  );
}
