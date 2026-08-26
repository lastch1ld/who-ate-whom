"use client";

import Link from "next/link";
import { motion, Variants } from "motion/react";
import { Industry } from "@/data/types";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function IndustryGrid({ industries }: { industries: Industry[] }) {
  return (
    <motion.div
      className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {industries.map((industry) =>
        industry.status === "available" ? (
          <motion.div key={industry.slug} variants={item}>
            <Link href={`/industry/${industry.slug}`} className="block h-full">
              <motion.div
                whileHover={{ y: -4, borderColor: "var(--color-accent)" }}
                transition={{ duration: 0.15 }}
                className="flex h-full flex-col gap-3 rounded-sm border border-rule bg-surface p-5 shadow-[0_1px_2px_rgba(27,36,32,0.06),0_8px_24px_rgba(27,36,32,0.05)]"
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent-ink">
                  Mapped
                </span>
                <h2 className="text-xl font-semibold">{industry.name}</h2>
                <p className="text-sm leading-relaxed text-ink-muted">{industry.description}</p>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key={industry.slug}
            variants={item}
            className="flex h-full flex-col gap-3 rounded-sm border border-rule bg-surface p-5 opacity-55"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              Coming soon
            </span>
            <h2 className="text-xl font-semibold">{industry.name}</h2>
            <p className="text-sm leading-relaxed text-ink-muted">{industry.description}</p>
          </motion.div>
        )
      )}
    </motion.div>
  );
}
