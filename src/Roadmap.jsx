import { useState } from "react";

/* ═══════════════════════ DATA ═══════════════════════ */

const TRACKS = [
  { key: "modeling", label: "Modeling & Simulation", icon: "◈" },
  { key: "data",     label: "Data & Semantics",     icon: "◇" },
  { key: "ai",       label: "AI / ML",              icon: "◆" },
  { key: "infra",    label: "Infrastructure",        icon: "▣" },
  { key: "standards",label: "Standards & Governance",icon: "△" },
];

const PHASES = [
  { key: "now",  label: "Current State",  time: "2024–2025", color: "#94a3b8" },
  { key: "near", label: "Near Term",      time: "2025–2026", color: "#6ee7b7" },
  { key: "mid",  label: "Mid Term",       time: "2027–2029", color: "#818cf8" },
  { key: "long", label: "Long Term",      time: "2030+",     color: "#f59e0b" },
];

const MATURITY = ["L1 Descriptive","L2 Informative","L3 Predictive","L4 Prescriptive","L5 Autonomous"];

const NODES = [
  // ── Current State ──
  { id: "N01", track: "modeling",  phase: "now",  title: "CAD/BIM-Based Static Models",
    desc: "Most twins are 3D geometry with metadata. Limited physics. Manual updates. Disconnected from live operations.",
    maturity: 0, deps: [] },
  { id: "N02", track: "data",     phase: "now",  title: "Siloed Data Systems",
    desc: "Historians, SCADA, MES, ERP each hold fragments. No unified semantic layer. ETL pipelines are brittle and vendor-locked.",
    maturity: 0, deps: [] },
  { id: "N03", track: "ai",       phase: "now",  title: "Rule-Based Analytics",
    desc: "Threshold alarms, simple trending. Some statistical process control. ML pilots exist but aren't production-grade.",
    maturity: 0, deps: [] },
  { id: "N04", track: "infra",    phase: "now",  title: "Cloud Dashboards + Edge Gateways",
    desc: "IoT platforms collect data. Visualization-heavy. Limited compute at the edge. Mostly one-directional (sense → cloud).",
    maturity: 0, deps: [] },
  { id: "N05", track: "standards",phase: "now",  title: "Emerging Frameworks",
    desc: "ISO 23247 published. AAS gaining traction in DACH region. W3C WoT, DTDL coexist without convergence.",
    maturity: 0, deps: [] },

  // ── Near Term ──
  { id: "N06", track: "modeling",  phase: "near", title: "Physics-Informed ML Surrogates",
    desc: "Hybrid models embedding conservation laws into neural networks. 100–1000× faster than full CFD/FEA while retaining physical consistency. Enables real-time what-if simulation.",
    maturity: 1, deps: ["N01","N03"] },
  { id: "N07", track: "data",     phase: "near", title: "Unified Asset Data Model",
    desc: "Adopt AAS (Asset Administration Shell) or DTDL as canonical schema. Automated mapping from legacy systems. Semantic tagging of time-series streams.",
    maturity: 1, deps: ["N02","N05"] },
  { id: "N08", track: "ai",       phase: "near", title: "Predictive Maintenance & Anomaly Detection",
    desc: "Production-grade ML pipelines: sensor drift correction, remaining-useful-life prediction, early fault detection. Target: 30–50% reduction in unplanned downtime.",
    maturity: 2, deps: ["N03","N02"] },
  { id: "N09", track: "infra",    phase: "near", title: "Cloud-Native Twin Platform",
    desc: "Microservice architecture on Kubernetes. Event-driven state synchronization. Edge nodes for local inference with <50ms latency. GitOps for twin model versioning.",
    maturity: 1, deps: ["N04"] },
  { id: "N10", track: "standards",phase: "near", title: "ISO 23247 + W3C WoT Adoption",
    desc: "Implement reference architecture per ISO 23247. W3C Thing Descriptions for device interoperability. Industry-specific profiles (pharma, automotive, energy).",
    maturity: 1, deps: ["N05"] },

  // ── Mid Term ──
  { id: "N11", track: "modeling",  phase: "mid",  title: "Multi-Scale Coupled Simulation",
    desc: "Seamlessly couple macro (FEA/CFD), meso (phase-field), and molecular (MD/DFT) scales. Adaptive fidelity — zoom in where anomalies emerge, coarsen elsewhere.",
    maturity: 2, deps: ["N06"] },
  { id: "N12", track: "data",     phase: "mid",  title: "Federated Knowledge Graphs",
    desc: "Cross-organization ontology alignment. Query a supplier's material twin from your process twin — no data migration needed. Privacy-preserving federated queries.",
    maturity: 3, deps: ["N07"] },
  { id: "N13", track: "ai",       phase: "mid",  title: "RL-Based Closed-Loop Optimization",
    desc: "Reinforcement learning agents continuously optimize process parameters. Sim-to-real transfer with domain randomization. Human-in-the-loop guardrails.",
    maturity: 3, deps: ["N08","N11"] },
  { id: "N14", track: "infra",    phase: "mid",  title: "6G-Connected Twins + Confidential Compute",
    desc: "6G provides deterministic sub-ms latency for twin synchronization. Confidential computing (TEEs) enables multi-party twin collaboration without data exposure.",
    maturity: 2, deps: ["N09"] },
  { id: "N15", track: "standards",phase: "mid",  title: "Cross-Domain Interoperability Protocol",
    desc: "Unified API layer across manufacturing, energy, healthcare twins. Composable twin interfaces. Machine-readable compliance specifications.",
    maturity: 2, deps: ["N10","N12"] },

  // ── Long Term ──
  { id: "N16", track: "modeling",  phase: "long", title: "Autonomous Model Generation",
    desc: "AI observes raw sensor streams and autonomously constructs, validates, and refines twin models. Symbolic regression discovers governing equations. Minimal human input.",
    maturity: 3, deps: ["N11","N13"] },
  { id: "N17", track: "data",     phase: "long", title: "Self-Curating Data Ecosystems",
    desc: "Twins self-assess data quality, request missing measurements, generate synthetic training data. Data lineage is fully automated and auditable.",
    maturity: 4, deps: ["N12"] },
  { id: "N18", track: "ai",       phase: "long", title: "Foundation Models for Physical Systems",
    desc: "Large pre-trained models for physics (analogous to LLMs for text). Transfer learning across domains: turbine → pump → compressor. Few-shot adaptation to new assets.",
    maturity: 4, deps: ["N13"] },
  { id: "N19", track: "infra",    phase: "long", title: "Decentralized Twin Mesh Network",
    desc: "Peer-to-peer network of twins communicating, negotiating, and co-optimizing without central orchestration. Blockchain-based provenance. Self-healing topology.",
    maturity: 4, deps: ["N14","N15"] },
  { id: "N20", track: "standards",phase: "long", title: "Universal Digital Twin Protocol",
    desc: "A single, extensible protocol (like HTTP for the web) that any twin can speak. Plug-and-play interoperability across all industries and scales.",
    maturity: 4, deps: ["N15"] },
];

const MILESTONES = [
  { phase: "near", label: "First closed-loop twin in production" },
  { phase: "mid",  label: "Cross-org twin federation operational" },
  { phase: "long", label: "Autonomous twin mesh at scale" },
];

/* ═══════════════════════ COMPONENT ═══════════════════════ */

export default function Roadmap() {
  const [selected, setSelected] = useState(null);
  const [hovId, setHovId] = useState(null);
  const [expandedTrack, setExpandedTrack] = useState(null);

  const sel = selected ? NODES.find(n => n.id === selected) : null;
  const selDeps = sel ? NODES.filter(n => sel.deps.includes(n.id)) : [];
  const selBlocks = sel ? NODES.filter(n => n.deps.includes(sel.id)) : [];

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: "#08080f",
      minHeight: "100vh",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ─── Header ─── */}
      <div style={{ padding: "28px 40px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, letterSpacing: -1, margin: 0,
            background: "linear-gradient(135deg, #818cf8, #6ee7b7)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Digital Twin — Technology Development Roadmap
          </h1>
          <p style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
            Click any node to explore details, dependencies, and maturity level
          </p>
        </div>
        {/* Legend */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {PHASES.map(p => (
            <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color }} />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main Grid ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 40px 12px" }}>

        {/* Phase header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "170px repeat(4, 1fr)",
          gap: 0, marginBottom: 2,
        }}>
          <div />
          {PHASES.map(p => (
            <div key={p.key} style={{
              textAlign: "center", padding: "8px 0",
              borderBottom: `3px solid ${p.color}`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.label}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>{p.time}</div>
            </div>
          ))}
        </div>

        {/* Track rows */}
        {TRACKS.map((track, ti) => {
          const isExpanded = expandedTrack === track.key;
          return (
            <div key={track.key} style={{
              display: "grid",
              gridTemplateColumns: "170px repeat(4, 1fr)",
              borderBottom: ti < TRACKS.length - 1 ? "1px solid #ffffff06" : "none",
              minHeight: isExpanded ? 110 : 80,
              transition: "min-height 0.2s",
            }}>
              {/* Track label */}
              <div
                onClick={() => setExpandedTrack(isExpanded ? null : track.key)}
                style={{
                  padding: "14px 12px", display: "flex", alignItems: "center", gap: 8,
                  cursor: "pointer", borderRight: "1px solid #ffffff06",
                }}
              >
                <span style={{ color: "#818cf8", fontSize: 14 }}>{track.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#c4b5fd" }}>{track.label}</span>
              </div>
              {/* Nodes per phase */}
              {PHASES.map(phase => {
                const node = NODES.find(n => n.track === track.key && n.phase === phase.key);
                if (!node) return <div key={phase.key} style={{ borderRight: "1px solid #ffffff04" }} />;
                const isSel = selected === node.id;
                const isHov = hovId === node.id;
                const isDep = sel && sel.deps.includes(node.id);
                const isBlocked = sel && node.deps.includes(sel.id);
                const dimmed = sel && !isSel && !isDep && !isBlocked;
                return (
                  <div key={phase.key} style={{
                    padding: "10px 10px",
                    borderRight: "1px solid #ffffff04",
                    display: "flex", alignItems: "center",
                    background: isSel ? `${phase.color}0c` : "transparent",
                  }}>
                    <button
                      onClick={() => setSelected(isSel ? null : node.id)}
                      onMouseEnter={() => setHovId(node.id)}
                      onMouseLeave={() => setHovId(null)}
                      style={{
                        width: "100%",
                        background: isSel
                          ? `${phase.color}18`
                          : isHov ? "#ffffff0a" : "#ffffff05",
                        border: isSel
                          ? `2px solid ${phase.color}66`
                          : isDep
                            ? `1px dashed ${PHASES.find(p=>p.key===sel?.phase)?.color || "#818cf8"}44`
                            : isBlocked
                              ? `1px dashed #f59e0b44`
                              : "1px solid #ffffff0a",
                        borderRadius: 10,
                        padding: "12px 14px",
                        cursor: "pointer",
                        textAlign: "left",
                        opacity: dimmed ? 0.3 : 1,
                        transition: "all 0.2s",
                        position: "relative",
                      }}
                    >
                      {/* Maturity badge */}
                      <div style={{
                        position: "absolute", top: 6, right: 8,
                        fontSize: 8, fontWeight: 700,
                        color: phase.color, opacity: 0.6,
                      }}>
                        {MATURITY[node.maturity]}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.3, paddingRight: 50 }}>
                        {node.title}
                      </div>
                      {(isSel || isExpanded) && (
                        <div style={{ fontSize: 10, color: "#64748b", marginTop: 6, lineHeight: 1.5 }}>
                          {node.desc.slice(0, 100)}{node.desc.length > 100 ? "…" : ""}
                        </div>
                      )}
                      {/* Dep arrow indicators */}
                      {isDep && (
                        <div style={{
                          position: "absolute", bottom: 4, right: 8,
                          fontSize: 9, color: "#818cf8", fontWeight: 600,
                        }}>← prerequisite</div>
                      )}
                      {isBlocked && (
                        <div style={{
                          position: "absolute", bottom: 4, right: 8,
                          fontSize: 9, color: "#f59e0b", fontWeight: 600,
                        }}>→ enables</div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Milestone row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "170px repeat(4, 1fr)",
          marginTop: 4,
        }}>
          <div style={{ padding: "8px 12px", fontSize: 10, fontWeight: 600, color: "#475569" }}>
            MILESTONES
          </div>
          {PHASES.map(phase => {
            const ms = MILESTONES.find(m => m.phase === phase.key);
            return (
              <div key={phase.key} style={{ padding: "8px 10px", textAlign: "center" }}>
                {ms && (
                  <span style={{
                    fontSize: 10, color: phase.color,
                    background: `${phase.color}12`, padding: "4px 12px",
                    borderRadius: 12, border: `1px solid ${phase.color}22`,
                    fontWeight: 600,
                  }}>
                    ★ {ms.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Detail Panel (bottom) ─── */}
      <div style={{
        minHeight: sel ? 180 : 0,
        maxHeight: sel ? 300 : 0,
        overflow: "hidden",
        transition: "all 0.3s ease",
        borderTop: sel ? "1px solid #ffffff0a" : "none",
      }}>
        {sel && (() => {
          const phase = PHASES.find(p => p.key === sel.phase);
          const track = TRACKS.find(t => t.key === sel.track);
          return (
            <div style={{ padding: "20px 40px", display: "flex", gap: 40 }}>
              {/* Left: main info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 16, color: "#818cf8" }}>{track.icon}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{sel.title}</h3>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: phase.color,
                    background: `${phase.color}15`, padding: "3px 10px",
                    borderRadius: 6, border: `1px solid ${phase.color}22`,
                  }}>{phase.label} · {phase.time}</span>
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, margin: 0, maxWidth: 600 }}>
                  {sel.desc}
                </p>
              </div>
              {/* Middle: maturity */}
              <div style={{ width: 180, flexShrink: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#475569", marginBottom: 8 }}>MATURITY TARGET</div>
                {MATURITY.map((m, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8, marginBottom: 3,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: 2,
                      background: i <= sel.maturity ? phase.color : "#ffffff0a",
                      border: `1px solid ${i <= sel.maturity ? `${phase.color}66` : "#ffffff12"}`,
                    }} />
                    <span style={{
                      fontSize: 10,
                      color: i <= sel.maturity ? "#e2e8f0" : "#475569",
                      fontWeight: i === sel.maturity ? 700 : 400,
                    }}>{m}</span>
                  </div>
                ))}
              </div>
              {/* Right: dependencies */}
              <div style={{ width: 220, flexShrink: 0 }}>
                {selDeps.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#475569", marginBottom: 6 }}>DEPENDS ON</div>
                    {selDeps.map(d => (
                      <div key={d.id}
                        onClick={() => setSelected(d.id)}
                        style={{
                          fontSize: 11, color: "#818cf8", cursor: "pointer",
                          marginBottom: 3, display: "flex", alignItems: "center", gap: 6,
                        }}>
                        <span style={{ color: "#818cf844" }}>←</span> {d.title}
                      </div>
                    ))}
                  </div>
                )}
                {selBlocks.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#475569", marginBottom: 6 }}>ENABLES</div>
                    {selBlocks.map(b => (
                      <div key={b.id}
                        onClick={() => setSelected(b.id)}
                        style={{
                          fontSize: 11, color: "#f59e0b", cursor: "pointer",
                          marginBottom: 3, display: "flex", alignItems: "center", gap: 6,
                        }}>
                        <span style={{ color: "#f59e0b44" }}>→</span> {b.title}
                      </div>
                    ))}
                  </div>
                )}
                {selDeps.length === 0 && selBlocks.length === 0 && (
                  <div style={{ fontSize: 11, color: "#475569" }}>No dependencies</div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
