"use client";

import { motion } from "motion/react";
import { CompanyNode, Industry } from "@/data/types";
import { familyColor, familyRootId } from "@/lib/family";

const BOX = 300;
const CENTER = BOX / 2;
const GOLDEN_ANGLE = 137.5 * (Math.PI / 180);

function tenureRadius(c: CompanyNode) {
  const years = (c.endYear ?? new Date().getFullYear()) - c.startYear;
  return 8 + Math.min(years / 5, 11);
}

function Cluster({
  survivor,
  absorbed,
  color,
}: {
  survivor: CompanyNode;
  absorbed: CompanyNode[];
  color: string;
}) {
  const sorted = [...absorbed].sort((a, b) => (a.endYear ?? 0) - (b.endYear ?? 0));
  const rootR = 22 + Math.sqrt(sorted.length) * 9;

  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <svg viewBox={`0 0 ${BOX} ${BOX}`} width={BOX} height={BOX} role="img" aria-label={`${survivor.name} absorbed ${sorted.length} companies`}>
        {sorted.map((c, i) => {
          const radius = 46 + i * 23;
          const angle = i * GOLDEN_ANGLE;
          const cx = CENTER + Math.cos(angle) * radius;
          const cy = CENTER + Math.sin(angle) * radius;
          const r = tenureRadius(c);
          return (
            <g key={c.id}>
              <motion.line
                x1={CENTER}
                y1={CENTER}
                x2={cx}
                y2={cy}
                stroke={color}
                strokeWidth={1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              />
              <motion.circle
                cx={cx}
                cy={cy}
                r={r}
                fill={color}
                fillOpacity={0.8}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.06 + 0.1 }}
              >
                <title>
                  {c.name} — {c.startYear}–{c.endYear}
                  {c.note ? `: ${c.note}` : ""}
                </title>
              </motion.circle>
            </g>
          );
        })}

        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={rootR}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
        />
        <text
          x={CENTER}
          y={CENTER - 3}
          textAnchor="middle"
          className="fill-white text-[11px] font-semibold"
        >
          {survivor.name.split(" ")[0]}
        </text>
        <text
          x={CENTER}
          y={CENTER + 11}
          textAnchor="middle"
          className="fill-white font-mono text-[10px] opacity-90"
        >
          {survivor.ticker}
        </text>
      </svg>
      <figcaption className="max-w-[260px] text-center text-[12px] leading-snug text-ink-muted">
        {sorted.length} absorbed — bubble size is years spent independent before being bought.
      </figcaption>
    </figure>
  );
}

export default function BubbleView({ industry }: { industry: Industry }) {
  const companies = industry.companies ?? [];
  const byId = new Map(companies.map((c) => [c.id, c]));
  const survivors = companies.filter((c) => c.status === "surviving");
  const orphans = companies.filter((c) => c.status === "defunct" && !c.parentId);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-6">
        {survivors.map((s) => (
          <Cluster
            key={s.id}
            survivor={s}
            color={familyColor(s.id)}
            absorbed={companies.filter((c) => c.id !== s.id && familyRootId(c, byId) === s.id)}
          />
        ))}
      </div>

      {orphans.length > 0 && (
        <div className="mt-6 border-t border-rule pt-5 text-center">
          <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Never absorbed — liquidated instead
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {orphans.map((o) => (
              <span
                key={o.id}
                className="inline-flex items-center gap-2 rounded-full border border-dashed border-rule px-3 py-1 text-[12px] text-ink-muted"
              >
                {o.name} <span className="font-mono text-[11px]">{o.endYear}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
