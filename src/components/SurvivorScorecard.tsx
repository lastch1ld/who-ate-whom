import { Industry } from "@/data/types";
import { familyColor, familyRootId } from "@/lib/family";

export default function SurvivorScorecard({ industry }: { industry: Industry }) {
  const companies = industry.companies ?? [];
  const byId = new Map(companies.map((c) => [c.id, c]));
  const survivors = companies.filter((c) => c.status === "surviving");

  return (
    <ul className="flex flex-col gap-3">
      {survivors.map((s) => {
        const absorbedCount = companies.filter(
          (c) => c.id !== s.id && familyRootId(c, byId) === s.id
        ).length;
        return (
          <li key={s.id} className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 flex-none rounded-full"
              style={{ background: familyColor(s.id) }}
            />
            <span className="flex flex-1 flex-col leading-tight">
              <span className="text-sm font-semibold">{s.name}</span>
              <span className="font-mono text-[11.5px] text-accent-ink">{s.ticker}</span>
            </span>
            <span className="whitespace-nowrap font-mono text-xs text-ink-muted">
              {absorbedCount} absorbed
            </span>
          </li>
        );
      })}
    </ul>
  );
}
