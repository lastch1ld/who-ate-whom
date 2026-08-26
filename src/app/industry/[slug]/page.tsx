import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, getIndustry } from "@/data/industries";
import ViewSwitcher from "@/components/ViewSwitcher";
import SurvivorScorecard from "@/components/SurvivorScorecard";
import MergerLog from "@/components/MergerLog";

export function generateStaticParams() {
  return industries.filter((i) => i.status === "available").map((i) => ({ slug: i.slug }));
}

const panel = "rounded-sm border border-rule bg-surface p-5 shadow-[0_1px_2px_rgba(27,36,32,0.06),0_8px_24px_rgba(27,36,32,0.05)]";
const panelTitle = "mb-3.5 font-mono text-[13px] font-medium uppercase tracking-wider text-ink-muted";

export default async function IndustryPage(props: PageProps<"/industry/[slug]">) {
  const { slug } = await props.params;
  const industry = getIndustry(slug);

  if (!industry || industry.status !== "available" || !industry.companies) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-12 pb-24">
      <Link
        href="/"
        className="mb-7 inline-flex items-center gap-1.5 font-mono text-[13px] text-ink-muted hover:text-accent-ink"
      >
        ← All industries
      </Link>

      <header className="flex flex-col gap-2.5 border-b border-rule pb-10 mb-10">
        <span className="font-mono text-xs uppercase tracking-wider text-accent-ink">
          {industry.chartStartYear}–{industry.chartEndYear}
        </span>
        <h1 className="text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05]">
          {industry.name}
        </h1>
        <p className="max-w-[62ch] text-[17px] leading-relaxed text-ink-muted">
          {industry.description}
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[2fr_1fr]">
        <section className={`${panel} col-span-full overflow-hidden`}>
          <h3 className={panelTitle}>Consolidation timeline</h3>
          <ViewSwitcher industry={industry} />
        </section>

        <section className={panel}>
          <h3 className={panelTitle}>Still standing</h3>
          <SurvivorScorecard industry={industry} />
        </section>

        <section className={panel}>
          <h3 className={panelTitle}>Merger log</h3>
          <MergerLog industry={industry} />
        </section>
      </div>
    </main>
  );
}
