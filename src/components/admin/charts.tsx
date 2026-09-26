"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hand-rolled SVG chart kit for the admin dashboard — sized for the site's
 * card language (rounded-[1.75rem] white panels) and its pine palette.
 * Everything is plain SVG + motion; no charting dependency. Data arrives as
 * plain serializable props from the server dashboard.
 */

const PINE = "#2f766d";
const HONEY = "#d97706";

/** Palette for callers building legends/segments outside this file. */
export const CHART_COLORS = { primary: PINE, accent: HONEY };

/* ------------------------------ area chart -------------------------------- */

type AreaChartProps = {
  labels: string[];
  values: number[];
  /** Singular noun for the tooltip, e.g. "article". */
  noun?: string;
  ariaLabel: string;
};

function smoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return "";
  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[Math.min(points.length - 1, i + 2)]!;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function AreaChart({
  labels,
  values,
  noun = "item",
  ariaLabel,
}: AreaChartProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  const W = 560;
  const H = 230;
  const pad = { l: 30, r: 16, t: 18, b: 30 };
  const n = values.length;
  const ymax = Math.max(4, Math.ceil(Math.max(...values, 1) * 1.2));

  const geom = useMemo(() => {
    const step = (W - pad.l - pad.r) / Math.max(1, n - 1);
    const x = (i: number) => pad.l + i * step;
    const y = (v: number) => pad.t + (1 - v / ymax) * (H - pad.t - pad.b);
    const pts = values.map((v, i) => ({ x: x(i), y: y(v) }));
    const line = smoothPath(pts);
    const base = H - pad.b;
    const area = line
      ? `${line} L ${pts[n - 1]!.x} ${base} L ${pts[0]!.x} ${base} Z`
      : "";
    const ticks = Array.from({ length: 5 }, (_, i) =>
      Math.round((ymax / 4) * i),
    );
    return { step, x, y, pts, line, area, base, ticks };
  }, [values, n, ymax, pad.l, pad.r, pad.t, pad.b]);

  const onMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const vx = ((event.clientX - rect.left) / rect.width) * W;
    const i = Math.round((vx - pad.l) / geom.step);
    setActive(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <div className="relative" role="img" aria-label={ariaLabel}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        onMouseMove={onMove}
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PINE} stopOpacity="0.22" />
            <stop offset="100%" stopColor={PINE} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* grid */}
        {geom.ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={geom.y(tick)}
              y2={geom.y(tick)}
              className="stroke-border"
              strokeDasharray="3 5"
              strokeWidth="1"
            />
            <text
              x={pad.l - 8}
              y={geom.y(tick) + 3.5}
              textAnchor="end"
              className="fill-muted text-[10px]"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* area + line */}
        <path d={geom.area} fill="url(#areaFill)" />
        <motion.path
          d={geom.line}
          fill="none"
          stroke={PINE}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* column highlight */}
        {active !== null && (
          <line
            x1={geom.x(active)}
            x2={geom.x(active)}
            y1={pad.t}
            y2={geom.base}
            className="stroke-primary/35"
            strokeWidth="1.5"
            strokeDasharray="2 4"
          />
        )}

        {/* points */}
        {geom.pts.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={active === i ? 5.5 : 3.5}
            className="fill-white stroke-primary transition-all duration-150"
            strokeWidth="2.5"
          />
        ))}

        {/* x labels */}
        {labels.map((label, i) => (
          <text
            key={label + i}
            x={geom.x(i)}
            y={H - 8}
            textAnchor="middle"
            className={cn(
              "text-[10px]",
              active === i ? "fill-foreground font-semibold" : "fill-muted",
            )}
          >
            {label}
          </text>
        ))}
      </svg>

      {active !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[135%] rounded-lg bg-pine-deep px-2.5 py-1.5 text-center text-xs font-semibold whitespace-nowrap text-white shadow-lg"
          style={{
            left: `${(geom.x(active) / W) * 100}%`,
            top: `${(geom.y(values[active]!) / H) * 100}%`,
          }}
        >
          {labels[active]} · {values[active]} {noun}
          {values[active] === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- donut ----------------------------------- */

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

export function DonutChart({
  segments,
  centerValue,
  centerLabel,
  ariaLabel,
}: {
  segments: DonutSegment[];
  centerValue: number;
  centerLabel: string;
  ariaLabel: string;
}) {
  const size = 168;
  const stroke = 20;
  const r = (size - stroke) / 2 - 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const fracs = segments.map((segment) =>
    total > 0 ? segment.value / total : 0,
  );
  const arcs = segments.map((segment, index) => ({
    ...segment,
    len: fracs[index]! * C,
    offset: fracs.slice(0, index).reduce((sum, f) => sum + f, 0) * C,
  }));

  return (
    <div
      className="flex items-center gap-6"
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-36 w-36 shrink-0"
        aria-hidden="true"
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            className="stroke-secondary"
            strokeWidth={stroke}
          />
          {arcs.map((arc) => (
            <circle
              key={arc.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${Math.max(arc.len - 3, 0)} ${C}`}
              strokeDashoffset={-arc.offset}
            />
          ))}
        </g>
        <text
          x={size / 2}
          y={size / 2 - 2}
          textAnchor="middle"
          className="fill-foreground font-heading text-[1.75rem] font-bold"
        >
          {centerValue}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 18}
          textAnchor="middle"
          className="fill-muted text-[11px]"
        >
          {centerLabel}
        </text>
      </svg>

      <ul className="min-w-0 space-y-3">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2.5">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span className="text-sm font-semibold text-foreground">
              {segment.label}
            </span>
            <span className="ml-auto font-heading text-sm font-bold text-muted">
              {segment.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------- bar list --------------------------------- */

export function BarList({
  items,
  ariaLabel,
}: {
  items: Array<{ label: string; value: number }>;
  ariaLabel: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="space-y-4" role="img" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-sm font-semibold text-foreground">
              {item.label}
            </span>
            <span className="font-heading text-sm font-bold text-muted">
              {item.value}
            </span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              whileInView={{ width: `${(item.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
        </li>
      ))}
      {items.length === 0 && (
        <li className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
          Nothing to chart yet.
        </li>
      )}
    </ul>
  );
}

/* ------------------------------ radial gauge ------------------------------ */

export function RadialGauge({
  value,
  total,
  caption,
  ariaLabel,
}: {
  value: number;
  total: number;
  caption: string;
  ariaLabel: string;
}) {
  const size = 168;
  const stroke = 20;
  const r = (size - stroke) / 2 - 2;
  const C = 2 * Math.PI * r;
  const frac = total > 0 ? Math.min(value / total, 1) : 0;

  return (
    <div className="flex items-center gap-6" role="img" aria-label={ariaLabel}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-36 w-36 shrink-0"
        aria-hidden="true"
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            className="stroke-secondary"
            strokeWidth={stroke}
          />
          {frac > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={PINE}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${frac * C} ${C}`}
            />
          )}
        </g>
        <text
          x={size / 2}
          y={size / 2 - 2}
          textAnchor="middle"
          className="fill-foreground font-heading text-[1.75rem] font-bold"
        >
          {value}
          <tspan className="fill-muted text-base font-semibold">/{total}</tspan>
        </text>
        <text
          x={size / 2}
          y={size / 2 + 18}
          textAnchor="middle"
          className="fill-muted text-[11px]"
        >
          customized
        </text>
      </svg>
      <p className="min-w-0 text-sm leading-relaxed text-muted">{caption}</p>
    </div>
  );
}
