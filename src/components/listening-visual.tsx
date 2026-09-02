"use client";

// Minimal SVG renderer for Listening plan/map/diagram labelling stimuli.
// Shows structural shapes (with only non-answer orientation labels) and BLANK
// letter markers. Never renders answer names.

import type { ListeningVisual } from "@/types/ielts";

export function ListeningVisualView({ visual }: { visual: ListeningVisual }) {
  return (
    <div className="rounded-md border border-border bg-white p-2">
      <svg
        viewBox={`0 0 ${visual.width} ${visual.height}`}
        className="h-auto w-full"
        role="img"
        aria-label={visual.kind === "plan" ? "Plan" : visual.kind === "map" ? "Map" : "Diagram"}
      >
        {visual.shapes.map((s) => {
          const common = { key: s.id, className: s.className ?? "fill-gray-100 stroke-gray-400" };
          switch (s.shape) {
            case "rect":
              return <rect {...common} x={s.x} y={s.y} width={s.w} height={s.h} strokeWidth={1.5} />;
            case "circle":
              return <circle {...common} cx={s.cx} cy={s.cy} r={s.r} strokeWidth={1.5} />;
            case "ellipse":
              return <ellipse {...common} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} strokeWidth={1.5} />;
            case "line":
              return <line {...common} x1={s.x} y1={s.y} x2={s.x2} y2={s.y2} strokeWidth={2} className="stroke-gray-400" />;
            case "polygon":
              return <polygon {...common} points={s.points} strokeWidth={1.5} />;
            default:
              return null;
          }
        })}
        {visual.shapes.map((s) =>
          s.label ? (
            <text
              key={`${s.id}-label`}
              x={s.cx ?? (s.x ?? 0) + (s.w ?? 0) / 2}
              y={(s.cy ?? (s.y ?? 0) + (s.h ?? 0) / 2) + 3}
              textAnchor="middle"
              className="fill-gray-500"
              fontSize={11}
            >
              {s.label}
            </text>
          ) : null,
        )}
        {visual.markers.map((m) => (
          <g key={m.id}>
            <circle cx={m.x} cy={m.y} r={10} className="fill-white stroke-accent" strokeWidth={1.8} />
            <text x={m.x} y={m.y + 3.5} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-accent">
              {m.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
