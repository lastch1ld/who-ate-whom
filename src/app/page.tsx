import { industries } from "@/data/industries";
import IndustryGrid from "@/components/IndustryGrid";

export default function Home() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-12 pb-24">
      <header className="flex flex-col gap-2.5 border-b border-rule pb-10 mb-10">
        <span className="font-mono text-xs uppercase tracking-wider text-accent-ink">
          Consolidation Atlas
        </span>
        <h1 className="text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05]">
          Who ate whom
        </h1>
        <p className="max-w-[62ch] text-[17px] leading-relaxed text-ink-muted">
          Every industry tends toward the same shape: many companies competing, then fewer and
          fewer as they merge, get acquired, or fold. This maps that story one industry at a
          time — who survived, who they absorbed, and when.
        </p>
      </header>

      <IndustryGrid industries={industries} />
    </main>
  );
}
