# Agent Host Resource Interference Profiler

**Category:** Performance

## Problem
Desktop AI agents can degrade pointer, keyboard, compositor, and general UI responsiveness across the workstation. Aggregate CPU/GPU/disk utilization can look moderate while one UI thread, helper retry loop, process fleet, GPU interaction, memory growth, or I/O storm creates severe interactive latency.

## Evidence
See `evidence/research.md` for current August 2026 reports and measurements across multiple Codex/ChatGPT Desktop versions and machines.

## Existing approach and limitations
Task Manager screenshots and restarts are useful clues but do not establish a same-machine latency baseline, process-family correlation, or verified improvement.

## Proposed improvement
Measure host responsiveness as an explicit SLO alongside process-family resource counters, use controlled before/after experiments, and gate performance claims on deterministic comparison.

## Architecture
```text
agent-host-resource-interference-profiler/
├── README.md
├── evidence/research.md
├── hooks/host-regression-gate.md
├── rules/host-performance-evidence.md
├── scripts/analyze_probe.py
├── scripts/windows_host_probe.ps1
├── skills/host-interference-investigation.md
├── subagents/benchmark-reviewer.md
├── tests/test_analyze_probe.py
└── workflows/measure-diagnose-optimize.md
```

## Installation
- Python 3.9+ for analysis; no third-party Python packages.
- Windows PowerShell 5.1+ or PowerShell 7+ for the supplied Windows probe.

## Configuration
Choose a process filter that captures the relevant desktop process family and a fixed duration/interval. Keep these identical between baseline and affected runs.

## Usage
Baseline with app closed:
`powershell -File scripts/windows_host_probe.ps1 -Output baseline.json -ProcessName ChatGPT -DurationSeconds 15`

Affected run:
`powershell -File scripts/windows_host_probe.ps1 -Output affected.json -ProcessName ChatGPT -DurationSeconds 15`

Compare:
`python scripts/analyze_probe.py --baseline baseline.json --affected affected.json --max-p95-ratio 1.5 --max-stall64-ratio 2.0`

## Workflow
Use `workflows/measure-diagnose-optimize.md`: Measure → Diagnose → Hypothesize → Optimize → Measure again → independent verification. Maximum two optimization attempts before re-evaluation/escalation.

## Metrics
p50/p95/p99/max scheduler gap, stall counts above interactive thresholds, process count, cumulative process CPU snapshot, working set and private memory. Teams may augment with ETW/WPA, GPU engine, disk byte deltas, and per-thread profiling.

## Verification
Run `python -m pytest tests/test_analyze_probe.py` if pytest is available. A candidate fix must pass the regression gate on comparable probes and improve the metric targeted by the hypothesis.

## Safety
The probe is read-only. Do not disable Defender/EDR, sandboxing, approval gates, or other security controls solely to improve numbers. If endpoint protection is suspected, measure its contribution and escalate rather than shipping a weakened baseline.

## Failure handling
Detection: analyzer exit 2 or reproducible host stalls. Evidence: raw JSON plus environment/workload metadata. Retry: maximum two measured intervention attempts. Fallback: revert ineffective change. Escalation: app/runtime/platform owner with minimal reproduction. Stop: no measurable reproduction after two controlled attempts or inaccessible vendor internals prevent further causal isolation.

## Definition of Done
- **Implemented:** targeted performance change exists.
- **Measured:** clean baseline, affected trace, and remeasurement exist.
- **Verified:** p95/stall thresholds pass, targeted resource metric improves when applicable, workload/functionality remains intact, and independent benchmark review accepts the comparison.

## Customization
Add platform probes for macOS/Linux while preserving the JSON `gap_ms` contract. Add process-tree, ETW, GPU/DWM, I/O, or worker-lifecycle fields under `process` or separate metadata; the core analyzer ignores unknown fields safely.
