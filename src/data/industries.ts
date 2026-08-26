import { Industry } from "./types";
import { airlines } from "./airlines";

// Add each new industry's data module here as it's built.
export const industries: Industry[] = [
  airlines,
  {
    slug: "banking",
    name: "U.S. Banking",
    description:
      "Thousands of regional and community banks rolled up into a handful of megabanks.",
    chartStartYear: 1980,
    chartEndYear: 2026,
    status: "coming-soon",
  },
  {
    slug: "telecom",
    name: "Telecom",
    description:
      "AT&T split into seven 'Baby Bells' in 1984, then spent thirty years recombining into two.",
    chartStartYear: 1984,
    chartEndYear: 2026,
    status: "coming-soon",
  },
  {
    slug: "big-tech",
    name: "Big Tech Acquisitions",
    description:
      "Hundreds of once-independent startups now sit inside a handful of platform companies.",
    chartStartYear: 2000,
    chartEndYear: 2026,
    status: "coming-soon",
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
