import { Industry } from "@/data/types";
import { familyColor, familyRootId } from "@/lib/family";

export default function MergerLog({ industry }: { industry: Industry }) {
  const companies = industry.companies ?? [];
  const byId = new Map(companies.map((c) => [c.id, c]));
  const events = companies
    .filter((c) => c.endYear !== undefined)
    .sort((a, b) => (a.endYear ?? 0) - (b.endYear ?? 0));

  return (
    <ol className="flex max-h-[420px] flex-col gap-2.5 overflow-y-auto">
      {events.map((c) => (
        <li key={c.id} className="grid grid-cols-[40px_10px_1fr] items-baseline gap-2.5 text-[13px] leading-snug">
          <span className="font-mono text-xs text-ink-muted">{c.endYear}</span>
          <span
            className="h-[7px] w-[7px] self-center rounded-full"
            style={{ background: familyColor(familyRootId(c, byId)) }}
          />
          <span className="text-ink-muted">
            <strong className="font-semibold text-ink">{c.name}</strong> — {c.note}
          </span>
        </li>
      ))}
    </ol>
  );
}
