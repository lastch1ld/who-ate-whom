"use client";

import { motion } from "motion/react";
import { CompanyNode, Industry } from "@/data/types";
import { familyColor } from "@/lib/family";

function TreeBranch({
  node,
  childrenByParent,
  color,
  depth,
}: {
  node: CompanyNode;
  childrenByParent: Map<string, CompanyNode[]>;
  color: string;
  depth: number;
}) {
  const kids = (childrenByParent.get(node.id) ?? []).sort(
    (a, b) => (a.endYear ?? 0) - (b.endYear ?? 0)
  );

  return (
    <li className="relative pl-4">
      {depth > 0 && (
        <span
          className="absolute left-0 top-[15px] h-px w-4 bg-rule"
          aria-hidden
        />
      )}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: depth * 0.08 }}
        className="inline-flex items-center gap-2 rounded-sm border border-rule bg-surface px-3 py-1.5"
      >
        <span
          className="h-2 w-2 flex-none rounded-full"
          style={{ background: color }}
          aria-hidden
        />
        <span className="text-[13.5px] font-medium leading-tight">
          {node.name}
          {node.ticker && (
            <span className="ml-1.5 font-mono text-[11.5px] text-accent-ink">{node.ticker}</span>
          )}
        </span>
        {node.status !== "surviving" && node.endYear && (
          <span className="font-mono text-[11px] text-ink-muted">{node.endYear}</span>
        )}
      </motion.div>

      {kids.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2 border-l border-rule pl-4">
          {kids.map((kid) => (
            <TreeBranch
              key={kid.id}
              node={kid}
              childrenByParent={childrenByParent}
              color={color}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TreeView({ industry }: { industry: Industry }) {
  const companies = industry.companies ?? [];
  const childrenByParent = new Map<string, CompanyNode[]>();
  for (const c of companies) {
    if (!c.parentId) continue;
    if (!childrenByParent.has(c.parentId)) childrenByParent.set(c.parentId, []);
    childrenByParent.get(c.parentId)!.push(c);
  }

  const survivors = companies.filter((c) => c.status === "surviving");
  const orphans = companies.filter(
    (c) => c.status === "defunct" && !c.parentId
  );

  return (
    <div>
      <div className="flex flex-col gap-8 md:flex-row md:flex-wrap">
        {survivors.map((s) => (
          <ul key={s.id} className="flex flex-col gap-2">
            <TreeBranch
              node={s}
              childrenByParent={childrenByParent}
              color={familyColor(s.id)}
              depth={0}
            />
          </ul>
        ))}
      </div>

      {orphans.length > 0 && (
        <div className="mt-8 border-t border-rule pt-5">
          <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Never absorbed — liquidated instead
          </p>
          <div className="flex flex-wrap gap-2">
            {orphans.map((o) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2 rounded-sm border border-dashed border-rule px-3 py-1.5 opacity-70"
              >
                <span className="text-[13px]">{o.name}</span>
                <span className="font-mono text-[11px] text-ink-muted">{o.endYear}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
