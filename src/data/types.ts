export type CompanyStatus = "surviving" | "absorbed" | "defunct";

export interface CompanyNode {
  /** Stable slug, unique within an industry. */
  id: string;
  name: string;
  /** Stock ticker while publicly traded, if any. */
  ticker?: string;
  status: CompanyStatus;
  /** Year the company starts appearing on the chart (founding year, or the
   *  industry's chart-start year if founded earlier). */
  startYear: number;
  /** Year it stopped existing independently (merger, renaming, liquidation).
   *  Omitted for companies still operating today. */
  endYear?: number;
  /** id of the CompanyNode it merged into at endYear. Omitted for
   *  "surviving" companies and for "defunct" companies that were
   *  liquidated rather than acquired. */
  parentId?: string;
  /** Vertical lane index, 0 at top. Assigned by hand per industry so that
   *  companies feeding the same parent sit near each other and tributary
   *  lines read cleanly. */
  lane: number;
  /** One-line, human-readable account of what happened at endYear. */
  note?: string;
}

export interface Industry {
  slug: string;
  name: string;
  /** Short standfirst shown on the hub card and industry page. */
  description: string;
  /** Chart x-axis domain. Companies founded earlier are clamped to start. */
  chartStartYear: number;
  chartEndYear: number;
  status: "available" | "coming-soon";
  companies?: CompanyNode[];
}
