import { useState, useEffect, useCallback } from "react";

/* ───────────────────── color palette ───────────────────── */
const C = {
  near: "#6ee7b7",    // green — near term
  mid: "#818cf8",     // indigo — mid term
  long: "#f59e0b",    // amber — long term
  vision: "#f472b6",  // pink — vision
  accent: "#818cf8",
  text: "#cbd5e1",
  muted: "#64748b",
  heading: "#f1f5f9",
  bg: "#0a0a0f",
};

/* ───────────────────── slide data ───────────────────── */
const SLIDES = [
  {
    id: "title",
    layout: "cover",
    title: "Digital Twin",
    subtitle: "Technology Development Roadmap",
    note: "From isolated models to autonomous, self-evolving cyber-physical systems",
  },
  {
    id: "landscape",
    layout: "text-diagram",
    title: "Where We Stand Today",
    bullets: [
      "Most digital twins are static 3D models or dashboards — not truly \"living\" replicas",
      "IoT infrastructure is maturing, but data integration remains fragmented",
      "AI/ML adoption in twins is early-stage: mostly rule-based, not yet learning autonomously",
      "Standards (ISO 23247, W3C WoT, AAS) are emerging but not yet converged",
    ],
    diagram: "mirror",
  },
  {
    id: "pillars",
    layout: "stack",
    title: "Technology Pillars",
    layers: [
      { label: "Autonomous Intelligence", desc: "Self-learning, self-healing, closed-loop decision making", color: "#f472b6" },
      { label: "Simulation & Physics Engine", desc: "Multi-physics, multi-scale, real-time solvers", color: "#a78bfa" },
      { label: "Data & Semantic Layer", desc: "Ontology, knowledge graph, data fusion, interoperability", color: "#818cf8" },
      { label: "Connectivity & Edge", desc: "IoT, 5G/6G, edge computing, time-series streaming", color: "#6366f1" },
      { label: "Sensing & Actuation", desc: "Smart sensors, embedded systems, robotic integration", color: "#4f46e5" },
    ],
  },
  {
    id: "roadmap-overview",
    layout: "roadmap",
    title: "Technology Evolution Roadmap",
    phases: [
      {
        period: "Near Term", time: "2025–2026", color: C.near,
        tracks: [
          { area: "Modeling", item: "Physics-informed ML surrogates" },
          { area: "Data", item: "Unified asset data models (AAS / DTDL)" },
          { area: "AI/ML", item: "Anomaly detection & predictive maintenance" },
          { area: "Infra", item: "Cloud-native twin platforms, edge preprocessing" },
          { area: "Standards", item: "ISO 23247 adoption, W3C WoT binding" },
        ],
      },
      {
        period: "Mid Term", time: "2027–2029", color: C.mid,
        tracks: [
          { area: "Modeling", item: "Multi-scale coupled simulation (CFD + FEA + molecular)" },
          { area: "Data", item: "Federated knowledge graphs across organizations" },
          { area: "AI/ML", item: "Reinforcement learning for real-time optimization" },
          { area: "Infra", item: "6G-connected twins, confidential computing" },
          { area: "Standards", item: "Cross-domain interoperability protocols" },
        ],
      },
      {
        period: "Long Term", time: "2030+", color: C.long,
        tracks: [
          { area: "Modeling", item: "Autonomous model generation from raw sensor data" },
          { area: "Data", item: "Self-curating data ecosystems, synthetic data parity" },
          { area: "AI/ML", item: "Foundation models for physical systems" },
          { area: "Infra", item: "Fully decentralized twin mesh networks" },
          { area: "Standards", item: "Universal Digital Twin Protocol (UDTP)" },
        ],
      },
    ],
  },
  {
    id: "near-term",
    layout: "phase-detail",
    title: "Near Term: Foundation Building",
    time: "2025–2026",
    color: C.near,
    items: [
      { label: "Physics-Informed ML", desc: "Hybrid models combining first-principles equations with neural networks to create fast, accurate surrogates for real-time simulation" },
      { label: "Asset Administration Shell", desc: "Standardized digital representation (AAS / DTDL) enabling plug-and-play integration of assets from different vendors" },
      { label: "Predictive Analytics", desc: "ML-driven anomaly detection and remaining-useful-life prediction, reducing unplanned downtime by 30–50%" },
      { label: "Cloud-Native Platforms", desc: "Containerized twin services on Kubernetes with edge preprocessing nodes for low-latency sensor ingestion" },
    ],
  },
  {
    id: "mid-term",
    layout: "phase-detail",
    title: "Mid Term: Integration & Intelligence",
    time: "2027–2029",
    color: C.mid,
    items: [
      { label: "Multi-Scale Simulation", desc: "Coupling macro (FEA/CFD), meso (phase-field), and micro (molecular dynamics) models within a single twin framework" },
      { label: "Federated Knowledge Graphs", desc: "Cross-organization semantic interoperability — query a supplier's material twin from your process twin without data migration" },
      { label: "RL-Based Optimization", desc: "Reinforcement learning agents that continuously optimize process parameters in closed-loop with the physical system" },
      { label: "Composable Twin Architecture", desc: "Twins of twins — hierarchical composition where component twins aggregate into system-level and enterprise-level twins" },
    ],
  },
  {
    id: "long-term",
    layout: "phase-detail",
    title: "Long Term: Autonomous Twins",
    time: "2030+",
    color: C.long,
    items: [
      { label: "Self-Constructing Models", desc: "AI that observes raw sensor streams and autonomously builds, validates, and refines digital twin models with minimal human input" },
      { label: "Foundation Models for Physics", desc: "Large pre-trained models (like LLMs, but for physical systems) that generalize across domains — transfer a turbine twin's knowledge to a pump" },
      { label: "Digital Twin Mesh", desc: "Fully decentralized peer-to-peer network of twins communicating, negotiating, and co-optimizing across organizational boundaries" },
      { label: "Cognitive Twins", desc: "Twins with causal reasoning capabilities — not just predicting 'what will happen' but understanding 'why' and suggesting redesigns" },
    ],
  },
  {
    id: "maturity",
    layout: "maturity",
    title: "Digital Twin Maturity Model",
    levels: [
      { level: "L1", name: "Descriptive", desc: "3D visualization and static data dashboards", color: "#475569" },
      { level: "L2", name: "Informative", desc: "Real-time sensor data integration and monitoring", color: "#6366f1" },
      { level: "L3", name: "Predictive", desc: "ML-based forecasting, what-if simulation", color: "#818cf8" },
      { level: "L4", name: "Prescriptive", desc: "Automated recommendations and decision support", color: "#a78bfa" },
      { level: "L5", name: "Autonomous", desc: "Self-learning, self-optimizing, closed-loop control", color: "#c084fc" },
    ],
  },
  {
    id: "enablers",
    layout: "grid-icons",
    title: "Critical Enabling Technologies",
    items: [
      { icon: "🧠", label: "AI / ML", desc: "GNNs, PINNs, RL, foundation models for scientific computing" },
      { icon: "📡", label: "IoT & 5G/6G", desc: "Ultra-low latency sensor networks with edge intelligence" },
      { icon: "☁️", label: "Cloud & HPC", desc: "Elastic compute for multi-physics simulation at scale" },
      { icon: "🔗", label: "Semantic Web", desc: "Ontologies, knowledge graphs, linked data for interoperability" },
      { icon: "🔐", label: "Confidential Computing", desc: "Secure multi-party computation for cross-org twin collaboration" },
      { icon: "🥽", label: "XR / Spatial Computing", desc: "Immersive interaction with twins via AR/VR/MR interfaces" },
    ],
  },
  {
    id: "challenges",
    layout: "two-col",
    title: "Challenges vs. Breakthroughs Needed",
    left: {
      heading: "Technical Challenges",
      items: [
        "Model fidelity vs. computational cost trade-off",
        "Real-time synchronization at scale (10K+ assets)",
        "Heterogeneous data fusion across protocols",
        "Validation and verification of twin accuracy",
        "Security of bi-directional physical-digital link",
      ],
    },
    right: {
      heading: "Breakthroughs Needed",
      items: [
        "GPU-accelerated multi-physics solvers (100× speedup)",
        "Self-calibrating sensor networks with drift correction",
        "Universal digital twin description language",
        "Explainable AI for physics-based predictions",
        "Zero-trust architecture for twin-to-twin communication",
      ],
    },
  },
  {
    id: "standards",
    layout: "text-list",
    title: "Standards & Ecosystem Landscape",
    items: [
      { label: "ISO 23247", desc: "Framework for digital twin manufacturing — reference architecture and data exchange" },
      { label: "Asset Admin Shell", desc: "Industry 4.0 standard for interoperable digital representations of industrial assets" },
      { label: "W3C Web of Things", desc: "Semantic descriptions for IoT devices enabling twin discovery and interaction" },
      { label: "DTDL", desc: "Microsoft's Digital Twin Definition Language — JSON-LD based modeling language" },
      { label: "FIWARE / NGSI-LD", desc: "Open-source smart data models and context broker for twin data management" },
    ],
  },
  {
    id: "vision",
    layout: "text-diagram",
    title: "The End State: Living Digital World",
    bullets: [
      "Every physical entity has a continuously synchronized digital counterpart",
      "Twins communicate peer-to-peer, forming an emergent intelligence layer",
      "Simulation replaces experimentation — design once, validate virtually, build once",
      "The boundary between physical and digital engineering dissolves entirely",
    ],
    diagram: "network",
  },
  {
    id: "end",
    layout: "cover",
    title: "Building the Future,\nOne Twin at a Time",
    subtitle: "",
    note: "Digital Twin Technology Development Roadmap",
  },
];

/* ───────────────────── diagram SVGs ───────────────────── */
function MirrorDiagram() {
  return (
    <svg viewBox="0 0 320 220" style={{ width: "100%", maxWidth: 320 }}>
      <rect x={20} y={30} width={110} height={140} rx={8} fill="#4f46e510" stroke="#4f46e5" strokeWidth={1.5} />
      <text x={75} y={55} textAnchor="middle" fill="#818cf8" fontSize={11} fontWeight={600}>Physical System</text>
      <rect x={40} y={70} width={30} height={24} rx={4} fill="#6366f120" stroke="#6366f1" strokeWidth={1} />
      <text x={55} y={86} textAnchor="middle" fill="#6366f1" fontSize={7}>sensor</text>
      <rect x={80} y={70} width={30} height={24} rx={4} fill="#6366f120" stroke="#6366f1" strokeWidth={1} />
      <text x={95} y={86} textAnchor="middle" fill="#6366f1" fontSize={7}>PLC</text>
      <rect x={40} y={105} width={70} height={24} rx={4} fill="#6366f120" stroke="#6366f1" strokeWidth={1} />
      <text x={75} y={121} textAnchor="middle" fill="#6366f1" fontSize={7}>process</text>
      <rect x={55} y={140} width={40} height={18} rx={4} fill="#4f46e530" stroke="#4f46e5" strokeWidth={1} />
      <text x={75} y={153} textAnchor="middle" fill="#4f46e5" fontSize={7}>asset</text>

      <rect x={190} y={30} width={110} height={140} rx={8} fill="#a78bfa10" stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="6,3" />
      <text x={245} y={55} textAnchor="middle" fill="#c4b5fd" fontSize={11} fontWeight={600}>Digital Twin</text>
      <rect x={210} y={70} width={30} height={24} rx={4} fill="#a78bfa15" stroke="#a78bfa" strokeWidth={1} strokeDasharray="4,2" />
      <text x={225} y={86} textAnchor="middle" fill="#a78bfa" fontSize={7}>model</text>
      <rect x={250} y={70} width={30} height={24} rx={4} fill="#a78bfa15" stroke="#a78bfa" strokeWidth={1} strokeDasharray="4,2" />
      <text x={265} y={86} textAnchor="middle" fill="#a78bfa" fontSize={7}>AI/ML</text>
      <rect x={210} y={105} width={70} height={24} rx={4} fill="#a78bfa15" stroke="#a78bfa" strokeWidth={1} strokeDasharray="4,2" />
      <text x={245} y={121} textAnchor="middle" fill="#a78bfa" fontSize={7}>simulation</text>
      <rect x={225} y={140} width={40} height={18} rx={4} fill="#a78bfa20" stroke="#a78bfa" strokeWidth={1} strokeDasharray="4,2" />
      <text x={245} y={153} textAnchor="middle" fill="#a78bfa" fontSize={7}>state</text>

      <line x1={135} y1={80} x2={185} y2={80} stroke="#6ee7b7" strokeWidth={1.5} markerEnd="url(#arrowG)" />
      <line x1={185} y1={130} x2={135} y2={130} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#arrowY)" />
      <text x={160} y={73} textAnchor="middle" fill="#6ee7b788" fontSize={8}>real-time data</text>
      <text x={160} y={145} textAnchor="middle" fill="#f59e0b88" fontSize={8}>control signals</text>

      <text x={160} y={195} textAnchor="middle" fill="#ffffff20" fontSize={9}>Today: mostly one-directional (data → twin)</text>
      <text x={160} y={210} textAnchor="middle" fill="#ffffff20" fontSize={9}>Future: fully bi-directional closed loop</text>
      <defs>
        <marker id="arrowG" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6ee7b7" /></marker>
        <marker id="arrowY" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f59e0b" /></marker>
      </defs>
    </svg>
  );
}

function NetworkDiagram() {
  const nodes = [
    { x: 160, y: 40, label: "Enterprise" },
    { x: 70, y: 100, label: "Plant A" },
    { x: 250, y: 100, label: "Plant B" },
    { x: 40, y: 170, label: "Line 1" },
    { x: 120, y: 180, label: "Line 2" },
    { x: 200, y: 170, label: "Line 3" },
    { x: 280, y: 180, label: "Supplier" },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,4],[5,6],[4,5]];
  return (
    <svg viewBox="0 0 320 230" style={{ width: "100%", maxWidth: 320 }}>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="#818cf822" strokeWidth={1} />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={18} fill="#6366f112" stroke="#818cf8" strokeWidth={1.5} />
          <circle cx={n.x} cy={n.y} r={5} fill="#a78bfa" />
          <text x={n.x} y={n.y + 30} textAnchor="middle" fill="#ffffff33" fontSize={8}>{n.label}</text>
        </g>
      ))}
      <text x={160} y={225} textAnchor="middle" fill="#ffffff20" fontSize={9}>Interconnected Twin Mesh</text>
    </svg>
  );
}

/* ───────────────────── slide renderers ───────────────────── */
const S = {
  slide: {
    width: "100vw", height: "100vh",
    display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center",
    padding: "60px 80px", position: "relative",
  },
  h2: { fontSize: 34, fontWeight: 700, letterSpacing: -1, marginBottom: 36, color: C.heading, textAlign: "center" },
};

function CoverSlide({ slide }) {
  return (
    <div style={{ ...S.slide, textAlign: "center" }}>
      <h1 style={{
        fontSize: 58, fontWeight: 800, letterSpacing: -2, lineHeight: 1.15, marginBottom: 16,
        background: "linear-gradient(135deg, #818cf8, #6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        whiteSpace: "pre-line",
      }}>
        {slide.title}
      </h1>
      {slide.subtitle && <p style={{ fontSize: 22, fontWeight: 300, color: "#94a3b8", marginBottom: 8 }}>{slide.subtitle}</p>}
      {slide.note && <p style={{ fontSize: 13, color: "#475569", marginTop: 16 }}>{slide.note}</p>}
    </div>
  );
}

function TextDiagramSlide({ slide }) {
  return (
    <div style={{ ...S.slide, flexDirection: "row", gap: 80, justifyContent: "center" }}>
      <div style={{ flex: "0 1 500px" }}>
        <h2 style={{ ...S.h2, textAlign: "left" }}>{slide.title}</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {slide.bullets.map((b, i) => (
            <li key={i} style={{ fontSize: 16, color: C.text, lineHeight: 1.8, display: "flex", gap: 12, marginBottom: 14 }}>
              <span style={{ color: C.accent, fontWeight: 700 }}>—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: "0 1 320px", display: "flex", alignItems: "center" }}>
        {slide.diagram === "mirror" ? <MirrorDiagram /> : <NetworkDiagram />}
      </div>
    </div>
  );
}

function StackSlide({ slide }) {
  return (
    <div style={S.slide}>
      <h2 style={S.h2}>{slide.title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 640, width: "100%" }}>
        {slide.layers.map((l, i) => (
          <div key={i} style={{
            background: `${l.color}10`, border: `1px solid ${l.color}30`,
            borderRadius: 10, padding: "16px 28px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: l.color }}>{l.label}</span>
            <span style={{ fontSize: 12, color: "#94a3b8", maxWidth: 340, textAlign: "right" }}>{l.desc}</span>
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "#475569" }}>▲ Higher abstraction &nbsp;&nbsp;|&nbsp;&nbsp; ▼ Closer to hardware</span>
        </div>
      </div>
    </div>
  );
}

function RoadmapSlide({ slide }) {
  const areas = [...new Set(slide.phases[0].tracks.map(t => t.area))];
  return (
    <div style={S.slide}>
      <h2 style={S.h2}>{slide.title}</h2>
      <div style={{ width: "100%", maxWidth: 880, overflow: "auto" }}>
        {/* Header row */}
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 1fr", gap: 0, marginBottom: 2 }}>
          <div />
          {slide.phases.map((p, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "10px 8px",
              borderBottom: `3px solid ${p.color}`,
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: p.color }}>{p.period}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{p.time}</div>
            </div>
          ))}
        </div>
        {/* Data rows */}
        {areas.map((area, ai) => (
          <div key={ai} style={{
            display: "grid", gridTemplateColumns: "100px 1fr 1fr 1fr", gap: 0,
            borderBottom: ai < areas.length - 1 ? "1px solid #ffffff08" : "none",
          }}>
            <div style={{
              padding: "14px 8px", fontSize: 12, fontWeight: 700,
              color: C.accent, display: "flex", alignItems: "center",
            }}>{area}</div>
            {slide.phases.map((p, pi) => {
              const track = p.tracks.find(t => t.area === area);
              return (
                <div key={pi} style={{
                  padding: "12px 14px", fontSize: 13, color: C.text, lineHeight: 1.5,
                  background: pi % 2 === 0 ? "#ffffff03" : "transparent",
                  borderLeft: `1px solid #ffffff06`,
                  display: "flex", alignItems: "center",
                }}>
                  <span style={{
                    display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                    background: p.color, marginRight: 10, flexShrink: 0,
                  }} />
                  {track?.item || "—"}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function PhaseDetailSlide({ slide }) {
  return (
    <div style={S.slide}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div style={{ width: 48, height: 4, borderRadius: 2, background: slide.color }} />
        <h2 style={{ ...S.h2, margin: 0 }}>{slide.title}</h2>
        <span style={{ fontSize: 14, color: slide.color, fontWeight: 600 }}>{slide.time}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 760 }}>
        {slide.items.map((item, i) => (
          <div key={i} style={{
            background: `${slide.color}08`, border: `1px solid ${slide.color}20`,
            borderRadius: 12, padding: "22px 24px",
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: slide.color, marginBottom: 8 }}>{item.label}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaturitySlide({ slide }) {
  return (
    <div style={S.slide}>
      <h2 style={S.h2}>{slide.title}</h2>
      <div style={{ maxWidth: 680, width: "100%" }}>
        {slide.levels.map((l, i) => {
          const pct = ((i + 1) / slide.levels.length) * 100;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              <span style={{
                fontSize: 13, fontWeight: 800, color: l.color,
                width: 28, textAlign: "right", flexShrink: 0,
              }}>{l.level}</span>
              <div style={{ flex: 1, position: "relative", height: 44, borderRadius: 8, overflow: "hidden" }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, bottom: 0,
                  width: `${pct}%`, background: `${l.color}18`,
                  borderRadius: 8, border: `1px solid ${l.color}30`,
                }} />
                <div style={{
                  position: "relative", padding: "10px 16px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: l.color }}>{l.name}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{l.desc}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div style={{ textAlign: "right", marginTop: 12 }}>
          <span style={{ fontSize: 11, color: "#475569" }}>Increasing capability →</span>
        </div>
      </div>
    </div>
  );
}

function GridIconsSlide({ slide }) {
  return (
    <div style={S.slide}>
      <h2 style={S.h2}>{slide.title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, maxWidth: 740 }}>
        {slide.items.map((item, i) => (
          <div key={i} style={{
            textAlign: "center", padding: "24px 16px",
            background: "#ffffff04", borderRadius: 12, border: "1px solid #ffffff08",
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.heading, marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TwoColSlide({ slide }) {
  const Col = ({ data, marker }) => (
    <div style={{ flex: 1 }}>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: C.accent, marginBottom: 20 }}>{data.heading}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.items.map((item, i) => (
          <li key={i} style={{ fontSize: 14, color: C.text, lineHeight: 1.7, marginBottom: 10, display: "flex", gap: 10 }}>
            <span style={{ color: marker, flexShrink: 0 }}>{marker === "#ef4444" ? "✗" : "✓"}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div style={S.slide}>
      <h2 style={S.h2}>{slide.title}</h2>
      <div style={{ display: "flex", gap: 60, maxWidth: 760 }}>
        <Col data={slide.left} marker="#ef4444" />
        <div style={{ width: 1, background: "#ffffff10" }} />
        <Col data={slide.right} marker="#6ee7b7" />
      </div>
    </div>
  );
}

function TextListSlide({ slide }) {
  return (
    <div style={S.slide}>
      <h2 style={S.h2}>{slide.title}</h2>
      <div style={{ maxWidth: 660, width: "100%" }}>
        {slide.items.map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: 20, alignItems: "baseline",
            padding: "14px 0", borderBottom: i < slide.items.length - 1 ? "1px solid #ffffff08" : "none",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, minWidth: 130, flexShrink: 0 }}>{item.label}</span>
            <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const RENDERERS = {
  cover: CoverSlide,
  "text-diagram": TextDiagramSlide,
  stack: StackSlide,
  roadmap: RoadmapSlide,
  "phase-detail": PhaseDetailSlide,
  maturity: MaturitySlide,
  "grid-icons": GridIconsSlide,
  "two-col": TwoColSlide,
  "text-list": TextListSlide,
};

/* ───────────────────── main component ───────────────────── */
export default function Slides() {
  const [idx, setIdx] = useState(0);
  const total = SLIDES.length;

  const go = useCallback((dir) => {
    setIdx((prev) => Math.max(0, Math.min(total - 1, prev + dir)));
  }, [total]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(-1); }
      if (e.key === "Home") { e.preventDefault(); setIdx(0); }
      if (e.key === "End") { e.preventDefault(); setIdx(total - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, total]);

  const slide = SLIDES[idx];
  const Renderer = RENDERERS[slide.layout];

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: C.bg, position: "relative", userSelect: "none" }}>
      {/* Top progress bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${C.near}, ${C.mid}, ${C.long}, ${C.vision})`,
        backgroundSize: `${total * 100}% 100%`,
        backgroundPosition: `${(idx / (total - 1)) * 100}% 0`,
        transition: "background-position 0.4s ease",
      }} />

      {/* Slide content */}
      <Renderer slide={slide} />

      {/* Bottom bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 32px",
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{
              width: i === idx ? 24 : 8, height: 6,
              borderRadius: 3, border: "none", cursor: "pointer",
              background: i === idx ? C.accent : "#ffffff12",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#475569", marginRight: 12, fontFamily: "monospace" }}>
            {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button onClick={() => go(-1)} disabled={idx === 0} style={{
            background: "#ffffff06", border: "1px solid #ffffff12",
            color: idx === 0 ? "#ffffff15" : "#ffffff66",
            width: 32, height: 32, borderRadius: 6,
            fontSize: 14, cursor: idx === 0 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>←</button>
          <button onClick={() => go(1)} disabled={idx === total - 1} style={{
            background: "#ffffff06", border: "1px solid #ffffff12",
            color: idx === total - 1 ? "#ffffff15" : "#ffffff66",
            width: 32, height: 32, borderRadius: 6,
            fontSize: 14, cursor: idx === total - 1 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>→</button>
        </div>
      </div>
    </div>
  );
}
