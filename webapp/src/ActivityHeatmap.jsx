import { useState, useMemo, useCallback } from "react";

/**
 * @typedef {Object} HeatmapCell
 * @property {number} day - Day index 0–6 (Mon–Sun)
 * @property {number} hour - Hour index 0–23
 * @property {number} intensity - Activity intensity 0–100
 */

/**
 * @typedef {'bookings' | 'searches' | 'workers'} DataMode
 */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const HOUR_LABELS = [
  { idx: 0, label: "12a" },
  { idx: 6, label: "6a" },
  { idx: 12, label: "12p" },
  { idx: 18, label: "6p" },
  { idx: 23, label: "11p" },
];

/* ── color helpers ─────────────────────────────────────────── */

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const h = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return h.length === 1 ? "0" + h : h;
      })
      .join("")
  );
}

/** Interpolate linearly between two hex colors. t ∈ [0, 1] */
function blendColors(hex1, hex2, t) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return rgbToHex(
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t
  );
}

/** Map an intensity 0–100 to a color on the brand gradient */
function getColor(intensity) {
  if (intensity === 0) return "#0A2E3E";
  if (intensity < 26) return `rgba(4, 101, 136, ${0.15 + intensity * 0.008})`;
  if (intensity < 61) return "#046588";
  if (intensity < 86) {
    const t = (intensity - 61) / 25;
    return blendColors("#046588", "#CFE87B", t);
  }
  return "#CFE87B";
}

/* ── mock data generators ──────────────────────────────────── */

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Generate a 7×24 grid of intensity values with realistic patterns.
 * @param {DataMode} mode
 * @returns {number[][]} grid[day][hour]
 */
function generateMockData(mode) {
  const rand = seededRandom(mode === "bookings" ? 42 : mode === "searches" ? 137 : 271);

  return DAYS.map((_, dayIdx) => {
    const isWeekend = dayIdx >= 5;
    return HOURS.map((hour) => {
      let base = 0;

      if (mode === "bookings") {
        // Morning rush 7–10, evening 17–20; weekends spread wider
        if (isWeekend) {
          base = hour >= 9 && hour <= 18 ? 55 + rand() * 40 : 5 + rand() * 15;
        } else {
          if (hour >= 7 && hour <= 10) base = 50 + rand() * 35;
          else if (hour >= 17 && hour <= 20) base = 60 + rand() * 40;
          else if (hour >= 11 && hour <= 16) base = 25 + rand() * 20;
          else base = rand() * 10;
        }
      } else if (mode === "searches") {
        // Searches peak earlier — lunch break & late evening browsing
        if (isWeekend) {
          base = hour >= 10 && hour <= 22 ? 40 + rand() * 55 : 3 + rand() * 10;
        } else {
          if (hour >= 12 && hour <= 13) base = 65 + rand() * 35;
          else if (hour >= 20 && hour <= 23) base = 55 + rand() * 40;
          else if (hour >= 8 && hour <= 19) base = 20 + rand() * 25;
          else base = rand() * 8;
        }
      } else {
        // New workers — sign-ups cluster around mornings & weekend afternoons
        if (isWeekend) {
          base = hour >= 13 && hour <= 17 ? 50 + rand() * 45 : 5 + rand() * 15;
        } else {
          if (hour >= 8 && hour <= 11) base = 35 + rand() * 35;
          else if (hour >= 18 && hour <= 21) base = 20 + rand() * 25;
          else base = rand() * 12;
        }
      }

      return Math.round(Math.max(0, Math.min(100, base)));
    });
  });
}

/* ── component ─────────────────────────────────────────────── */

const TABS = [
  { id: "bookings", label: "Bookings" },
  { id: "searches", label: "Searches" },
  { id: "workers", label: "New Workers" },
];

/**
 * Neighborhood activity heatmap — 7-day × 24-hour grid showing booking /
 * search / sign-up density. Pure CSS-grid rendering, no charting libraries.
 */
export default function ActivityHeatmap() {
  const [mode, setMode] = useState("bookings");
  const [tooltip, setTooltip] = useState(null); // { day, hour, intensity, x, y }

  const grid = useMemo(() => generateMockData(mode), [mode]);

  const handleCellEnter = useCallback((e, dayIdx, hour, intensity) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      day: DAYS[dayIdx],
      hour,
      intensity,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }, []);

  const handleCellLeave = useCallback(() => setTooltip(null), []);

  const formatHour = (h) => {
    if (h === 0) return "12am";
    if (h < 12) return h + "am";
    if (h === 12) return "12pm";
    return h - 12 + "pm";
  };

  /* ── responsive: collapse to 12 cols on narrow screens ─── */
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const visibleHours = isMobile
    ? HOURS.filter((_, i) => i % 2 === 0) // every other hour → 12 cols
    : HOURS;

  return (
    <div style={{ position: "relative" }}>
      {/* ── tabs ───────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            style={{
              padding: "7px 16px",
              borderRadius: 6,
              border: mode === t.id ? "none" : "1px solid #E2E8F0",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
              fontFamily: "inherit",
              transition: "all 0.15s",
              letterSpacing: "0.02em",
              background: mode === t.id ? "#046588" : "#0A2E3E",
              color: mode === t.id ? "#fff" : "#6A8899",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── card ───────────────────────────────── */}
      <div
        style={{
          background: "#0A2E3E",
          border: "1px solid rgba(106,136,153,0.2)",
          borderRadius: 12,
          padding: isMobile ? "14px 10px 18px" : "20px 22px 24px",
        }}
      >
        {/* header */}
        <div style={{ marginBottom: 16 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
            }}
          >
            Neighborhood Activity
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: "#6A8899",
              letterSpacing: "0.01em",
            }}
          >
            Hourly {mode === "workers" ? "sign-up" : mode} density — past 7 days
          </p>
        </div>

        {/* ── grid ──────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `36px repeat(${visibleHours.length}, 1fr)`,
            gap: 2,
            alignItems: "center",
          }}
        >
          {/* top-left spacer */}
          <div />

          {/* x-axis hour labels */}
          {visibleHours.map((h) => {
            const label = HOUR_LABELS.find((l) => l.idx === h);
            return (
              <div
                key={h}
                style={{
                  fontSize: 9,
                  color: "#6A8899",
                  textAlign: "center",
                  userSelect: "none",
                  lineHeight: 1,
                  paddingBottom: 3,
                  fontWeight: 500,
                }}
              >
                {label ? label.label : ""}
              </div>
            );
          })}

          {/* rows: day label + cells */}
          {grid.map((row, dayIdx) => (
            <>
              {/* day label */}
              <div
                key={"d" + dayIdx}
                style={{
                  fontSize: 11,
                  color: "#6A8899",
                  fontWeight: 500,
                  textAlign: "right",
                  paddingRight: 8,
                  userSelect: "none",
                }}
              >
                {DAYS[dayIdx]}
              </div>

              {/* cells */}
              {visibleHours.map((hour) => {
                const intensity = row[hour];
                return (
                  <div
                    key={dayIdx + "-" + hour}
                    onMouseEnter={(e) =>
                      handleCellEnter(e, dayIdx, hour, intensity)
                    }
                    onMouseLeave={handleCellLeave}
                    style={{
                      aspectRatio: "1",
                      borderRadius: 4,
                      background: getColor(intensity),
                      transition: "background 0.2s, transform 0.15s",
                      cursor: "default",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.15)";
                      e.currentTarget.style.zIndex = "2";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.zIndex = "0";
                    }}
                  />
                );
              })}
            </>
          ))}
        </div>

        {/* ── legend ────────────────────────────── */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background:
                "linear-gradient(to right, #0A2E3E 0%, #046588 50%, #CFE87B 100%)",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <span style={{ fontSize: 10, color: "#6A8899", fontWeight: 500 }}>
              No activity
            </span>
            <span style={{ fontSize: 10, color: "#6A8899", fontWeight: 500 }}>
              Peak activity
            </span>
          </div>
        </div>
      </div>

      {/* ── tooltip ────────────────────────────── */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
            background: "#021C28",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 50,
            letterSpacing: "0.01em",
            boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
          }}
        >
          {tooltip.day} {formatHour(tooltip.hour)} —{" "}
          <span style={{ color: "#CFE87B", fontWeight: 700 }}>
            {tooltip.intensity}
          </span>
        </div>
      )}
    </div>
  );
}
