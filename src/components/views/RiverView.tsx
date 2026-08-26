"use client";

import { motion } from "motion/react";
import { Industry } from "@/data/types";
import { familyColor, familyRootId } from "@/lib/family";

const LANE_H = 27;
const MARGIN_TOP = 28;
const MARGIN_BOTTOM = 40;
const MARGIN_LEFT = 14;
const MARGIN_RIGHT = 214;
const PX_PER_YEAR = 24;
const STROKE_W = 9;
const CURVE_RUN = 30;

export default function RiverView({ industry }: { industry: Industry }) {
  const companies = industry.companies ?? [];
  const byId = new Map(companies.map((c) => [c.id, c]));
  const laneCount = Math.max(...companies.map((c) => c.lane)) + 1;

  const x = (year: number) => MARGIN_LEFT + (year - industry.chartStartYear) * PX_PER_YEAR;
  const y = (lane: number) => MARGIN_TOP + lane * LANE_H + LANE_H / 2;

  const width = x(industry.chartEndYear) + MARGIN_RIGHT;
  const height = MARGIN_TOP + laneCount * LANE_H + MARGIN_BOTTOM;

  const decades: number[] = [];
  for (
    let yr = Math.ceil(industry.chartStartYear / 10) * 10;
    yr <= industry.chartEndYear;
    yr += 10
  ) {
    decades.push(yr);
  }

  return (
    <figure className="m-0">
      <div className="overflow-x-auto pb-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          className="block"
          aria-label={`Timeline of ${industry.name} mergers from ${industry.chartStartYear} to today, showing which companies were absorbed into which survivors.`}
        >
          {decades.map((yr) => (
            <g key={yr}>
              <line
                x1={x(yr)}
                x2={x(yr)}
                y1={MARGIN_TOP - 8}
                y2={height - MARGIN_BOTTOM + 8}
                className="stroke-rule"
                strokeWidth={1}
              />
              <text
                x={x(yr)}
                y={height - MARGIN_BOTTOM + 22}
                textAnchor="middle"
                className="fill-ink-muted font-mono text-[11px]"
              >
                {yr}
              </text>
            </g>
          ))}

          {companies.map((c, i) => {
            const rootId = familyRootId(c, byId);
            const color = familyColor(rootId);
            const endX = x(c.endYear ?? industry.chartEndYear);
            const startX = x(c.startYear);
            const opacity = c.status === "defunct" ? 0.5 : c.status === "absorbed" ? 0.82 : 1;

            return (
              <g key={c.id}>
                <motion.line
                  x1={startX}
                  x2={endX}
                  y1={y(c.lane)}
                  y2={y(c.lane)}
                  stroke={color}
                  strokeWidth={c.status === "surviving" ? STROKE_W + 2 : STROKE_W}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity }}
                  transition={{ duration: 0.7, delay: i * 0.025, ease: "easeOut" }}
                />
                <motion.text
                  x={startX + 8}
                  y={y(c.lane) - 9}
                  className="fill-ink text-[10.5px] opacity-85"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  transition={{ duration: 0.4, delay: i * 0.025 + 0.3 }}
                >
                  {c.name}
                  {c.ticker ? (
                    <tspan className="fill-accent-ink font-mono"> {c.ticker}</tspan>
                  ) : null}
                </motion.text>

                {c.parentId && byId.has(c.parentId) && (
                  <>
                    <motion.path
                      d={`M ${endX} ${y(c.lane)} C ${endX + CURVE_RUN * 0.5} ${y(c.lane)}, ${
                        endX + CURVE_RUN * 0.5
                      } ${y(byId.get(c.parentId)!.lane)}, ${endX + CURVE_RUN} ${y(
                        byId.get(c.parentId)!.lane
                      )}`}
                      fill="none"
                      stroke={color}
                      strokeWidth={STROKE_W * 0.6}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.85 }}
                      transition={{ duration: 0.5, delay: i * 0.025 + 0.5, ease: "easeOut" }}
                    />
                    <motion.circle
                      cx={endX + CURVE_RUN}
                      cy={y(byId.get(c.parentId)!.lane)}
                      r={3}
                      fill={color}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.025 + 0.9 }}
                    />
                  </>
                )}

                {c.status === "surviving" && (
                  <motion.text
                    x={endX + 14}
                    y={y(c.lane)}
                    dominantBaseline="middle"
                    className="fill-ink text-[13px] font-semibold"
                    initial={{ opacity: 0, x: endX }}
                    animate={{ opacity: 1, x: endX + 14 }}
                    transition={{ duration: 0.5, delay: i * 0.025 + 0.4 }}
                  >
                    {c.name}
                    <tspan className="fill-accent-ink text-xs font-medium"> {c.ticker}</tspan>
                  </motion.text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3.5 max-w-[72ch] text-[13px] leading-relaxed text-ink-muted">
        Each line is one company; a curve shows the year it merged into another. Line color
        marks which of today&rsquo;s survivors a company&rsquo;s history flows into. Band widths
        are illustrative, not proportional to fleet size or revenue.
      </figcaption>
    </figure>
  );
}
